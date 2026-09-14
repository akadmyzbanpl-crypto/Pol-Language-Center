import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
];

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  size?: string;
}

export interface SpreadsheetInfo {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets?: Array<{ properties: { sheetId: number; title: string } }>;
}

export interface DocInfo {
  documentId: string;
  title: string;
  body?: any;
}

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Provider setup
const provider = new GoogleAuthProvider();
SCOPES.forEach((s) => provider.addScope(s));
provider.setCustomParameters({
  prompt: 'select_account',
});

export const googleWorkspaceService = {
  getScopes(): string[] {
    return SCOPES;
  },

  hasAccessToken(): boolean {
    return Boolean(cachedAccessToken);
  },

  getAccessToken(): string | null {
    return cachedAccessToken;
  },

  setAccessToken(token: string | null) {
    cachedAccessToken = token;
  },

  initAuth(
    onSuccess?: (user: FirebaseUser, token: string) => void,
    onFailure?: () => void
  ) {
    if (!auth) {
      if (onFailure) onFailure();
      return () => {};
    }

    return onAuthStateChanged(auth, (user) => {
      if (user && cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onFailure) onFailure();
      }
    });
  },

  async signInWithGoogle(): Promise<{ user: FirebaseUser; accessToken: string }> {
    if (!auth) {
      throw new Error('سیستم احراز هویت Firebase در دسترس نیست');
    }

    try {
      isSigningIn = true;
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (!token) {
        throw new Error('توکن دسترسی Google Workspace دریافت نشد');
      }

      cachedAccessToken = token;
      return { user: result.user, accessToken: token };
    } finally {
      isSigningIn = false;
    }
  },

  async signOut(): Promise<void> {
    if (auth) {
      await auth.signOut();
    }
    cachedAccessToken = null;
  },

  // ----------------------------------------------------
  // GOOGLE DRIVE API
  // ----------------------------------------------------
  async listDriveFiles(query?: string): Promise<DriveFileItem[]> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    let url =
      'https://www.googleapis.com/drive/v3/files?pageSize=30&fields=files(id,name,mimeType,modifiedTime,webViewLink,iconLink,size)&orderBy=modifiedTime desc';
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `خطا در دریافت فایل‌های گوگل درایو (${response.status})`);
    }

    const data = await response.json();
    return data.files || [];
  },

  async createDriveFolder(folderName: string): Promise<DriveFileItem> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    const metadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const res = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'خطا در ساخت پوشه در گوگل درایو');
    }

    return await res.json();
  },

  async deleteDriveFile(fileId: string, fileName: string): Promise<void> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `خطا در حذف فایل ${fileName}`);
    }
  },

  // ----------------------------------------------------
  // GOOGLE SHEETS API
  // ----------------------------------------------------
  async createSpreadsheet(
    title: string,
    initialData?: { sheetTitle?: string; rows: (string | number)[][] }
  ): Promise<SpreadsheetInfo> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    const body: any = {
      properties: {
        title,
      },
    };

    if (initialData?.sheetTitle) {
      body.sheets = [
        {
          properties: {
            title: initialData.sheetTitle,
          },
        },
      ];
    }

    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'خطا در ایجاد گوگل شیت');
    }

    const sheetInfo: SpreadsheetInfo = await res.json();

    // If initial rows provided, append them
    if (initialData?.rows && initialData.rows.length > 0) {
      const targetRange = initialData.sheetTitle ? `${initialData.sheetTitle}!A1` : 'A1';
      await this.appendSheetValues(sheetInfo.spreadsheetId, targetRange, initialData.rows);
    }

    return sheetInfo;
  },

  async getSheetValues(spreadsheetId: string, range: string): Promise<(string | number)[][]> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'خطا در خواندن اطلاعات گوگل شیت');
    }

    const data = await res.json();
    return data.values || [];
  },

  async appendSheetValues(
    spreadsheetId: string,
    range: string,
    values: (string | number)[][]
  ): Promise<void> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'خطا در درج ردیف‌های جدید به گوگل شیت');
    }
  },

  // ----------------------------------------------------
  // GOOGLE DOCS API
  // ----------------------------------------------------
  async createDocument(title: string, initialContent?: string): Promise<DocInfo> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    const res = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'خطا در ایجاد گوگل داکس');
    }

    const doc: DocInfo = await res.json();

    if (initialContent) {
      await this.appendDocText(doc.documentId, initialContent);
    }

    return doc;
  },

  async getDocument(documentId: string): Promise<DocInfo> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    const res = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'خطا در دریافت سند گوگل داکس');
    }

    return await res.json();
  },

  async appendDocText(documentId: string, text: string): Promise<void> {
    const token = this.getAccessToken();
    if (!token) throw new Error('لطفاً ابتدا با حساب Google وارد شوید');

    const body = {
      requests: [
        {
          insertText: {
            endOfSegmentLocation: {},
            text: text + '\n',
          },
        },
      ],
    };

    const res = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'خطا در درج متن در سند');
    }
  },

  // ----------------------------------------------------
  // ACADEMY TEMPLATES HELPERS
  // ----------------------------------------------------
  async createClassAttendanceSheet(className: string, teacherName: string): Promise<SpreadsheetInfo> {
    const title = `کارنامه و حضور غیاب - ${className} (${new Date().toLocaleDateString('fa-IR')})`;
    const headers = [
      ['آموزشگاه زبان پل - فرم رسمی حضور و غیاب و ارزشیابی کلاس'],
      [`نام کلاس: ${className}`, `مدرس: ${teacherName}`, `تاریخ صدور: ${new Date().toLocaleDateString('fa-IR')}`],
      [''],
      ['ردیف', 'کد زبان‌آموز', 'نام و نام خانوادگی', 'جلسه ۱', 'جلسه ۲', 'جلسه ۳', 'جلسه ۴', 'جلسه ۵', 'نمره میان‌ترم', 'نمره پایان‌ترم', 'وضعیت نهایی'],
      ['1', 'ST-101', 'سارا احمدی', 'حاضر', 'حاضر', 'غایب', 'حاضر', 'حاضر', '18.5', '19', 'قبول'],
      ['2', 'ST-102', 'علی کاظمی', 'حاضر', 'حاضر', 'حاضر', 'حاضر', 'حاضر', '17', '18', 'قبول'],
      ['3', 'ST-103', 'نیلوفر محمدی', 'غایب', 'حاضر', 'حاضر', 'حاضر', 'حاضر', '19', '19.5', 'ممتاز'],
      ['4', 'ST-104', 'حسین رضوی', 'حاضر', 'غایب', 'حاضر', 'حاضر', 'حاضر', '16', '16.5', 'قبول'],
    ];

    return await this.createSpreadsheet(title, {
      sheetTitle: 'حضور و غیاب ترم',
      rows: headers,
    });
  },

  async createIeltsWritingFeedbackDoc(studentName: string, taskType: string): Promise<DocInfo> {
    const title = `ارزیابی رایتینگ آیلتس - ${studentName} (${taskType})`;
    const template = `آموزشگاه زبان پل | مرکز تخصصی آزمون‌های بین‌المللی
==============================================
فرم فیدبک و تصحیح رایتینگ آزمون آزمایشی آیلتس (IELTS Mock)
زبان‌آموز: ${studentName}
موضوع / تسک: ${taskType}
تاریخ بررسی: ${new Date().toLocaleDateString('fa-IR')}

معیارهای چهارگانه ارزیابی آیلتس (Band Score 0-9):
--------------------------------------------------
۱. Task Achievement / Response: [نمره: ۷.۵]
   - نکات قوت: تحلیل مناسب ساختار نمودار / بسط منطقی پاراگراف‌های اصلی
   - موارد نیازمند بهبود: جمع‌بندی خلاصه نهایی در انتهای متن

۲. Coherence and Cohesion (انسجام و پیوستگی): [نمره: ۷.۰]
   - کاربرد مناسب کلمات ربط (Linking Words) نظیر Furthermore, In contrast
   - دقت در پاراگراف‌بندی و تفکیک موضوعات

۳. Lexical Resource (دایره واژگان): [نمره: ۷.۵]
   - استفاده از کالوکیشن‌های پیشرفته و واژگان تخصصی آکادمیک

۴. Grammatical Range and Accuracy (گرامر و دقت نگارشی): [نمره: ۷.۰]
   - جملات مرکب و پیچیده خوب به کار رفته است. توجه به زمان افعال گذشته توصیه می‌شود.

نمره کل تخمینی (Overall Estimated Band Score): 7.5
توصیه مدرس: تمرکز روی مدیریت زمان تسک ۲ و بازبینی املای کلمات کلیدی.
==============================================`;

    return await this.createDocument(title, template);
  },

  async createLessonPlanDoc(courseName: string): Promise<DocInfo> {
    const title = `طرح درس و سیلابس ترمیک - ${courseName}`;
    const template = `سیلابس و برنامه آموزشی دوره ${courseName}
آموزشگاه زبان پل
-----------------------------------------------------
هدف دوره: ارتقای مهارت گفتاری، شنیداری و ساختارهای پیشرفته
تعداد جلسات: ۲۰ جلسه (هر جلسه ۹۰ دقیقه)
کتاب اصلی: Mindset for IELTS & Focus on Grammar

برنامه هفتگی:
- جلسه ۱ الی ۴: اصول کلی، واژگان پایه‌ای، معرفی آزمون
- جلسه ۵ الی ۱۰: تکنیک‌های تندخوانی ریدینگ، استراتژی‌های شنیداری
- جلسه ۱۱ الی ۱۵: مهارت مکالمه تسک‌های ۱ تا ۳ اسپیکینگ
- جلسه ۱۶ الی ۲۰: مرور کلی، آزمون آزمایشی (Mock) و تحلیل نقاط ضعف
-----------------------------------------------------`;

    return await this.createDocument(title, template);
  },
};
