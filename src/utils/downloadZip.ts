import { SNEH_ZIP_BASE64 } from './zipBase64';

export function triggerDirectZipDownload(filename = 'sneh-dating-app-full-source.zip') {
  try {
    const byteCharacters = atob(SNEH_ZIP_BASE64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/zip' });

    // Trigger instant client-side download in Chrome/Android
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);

    return true;
  } catch (error) {
    console.error('Failed to trigger base64 zip download:', error);
    // Fallback to static URL
    window.location.href = '/sneh-dating-app-full-source.zip';
    return false;
  }
}
