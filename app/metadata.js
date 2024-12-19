// app/metadata.js
export const metadata = {
    manifest: '/manifest.json',
    title: "ERP System",
    description: "ERP system with Attendance and Feedback modules",

    icons: {
      icon: '/icon512_maskable.png',
      apple: '/icon512_rounded.png',
    },
    openGraph: {
      title: 'ERP System',
      description: 'Comprehensive Enterprise Resource Planning Solution',
      images: ['/icon512_maskable.png']
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ERP System',
      description: 'Comprehensive Enterprise Resource Planning Solution',
      images: ['/icon512_maskable.png']
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'application-name': 'ERP System',
      'apple-mobile-web-app-title': 'ERP System',
    }
  };