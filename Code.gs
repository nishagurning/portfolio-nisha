const RECIPIENT_EMAIL = 'damegurning3@gmail.com';

function doGet() {
  return renderResult(
    'Endpoint formulir aktif',
    'Google Apps Script sudah aktif. Kembali ke website portofolio untuk mengirim pesan melalui formulir.'
  );
}

function doPost(e) {
  try {
    const fields = e && e.parameter ? e.parameter : {};
    const name = (fields.name || '').trim();
    const senderEmail = (fields.email || '').trim();
    const subject = (fields.subject || '').trim();
    const message = (fields.message || '').trim();

    if (!name || !subject || !message || message.length > 500) {
      throw new Error('Form tidak lengkap atau pesan melebihi 500 karakter.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      throw new Error('Alamat email pengirim tidak valid.');
    }

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      replyTo: senderEmail,
      subject: `${subject} - ${name}`.slice(0, 180),
      body: `Nama: ${name}\nEmail: ${senderEmail}\nSubjek: ${subject}\n\n${message}`,
      name: 'Form Portofolio Nisha'
    });

    return renderResult(
      'Pesan berhasil dikirim',
      'Terima kasih sudah menghubungi saya. Pesan Anda sudah dikirim.'
    );
  } catch (error) {
    console.error(error);
    return renderResult(
      'Pesan belum terkirim',
      'Terjadi kendala saat mengirim pesan. Silakan kembali ke website dan coba lagi.'
    );
  }
}

function renderResult(title, message) {
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="id"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + title + '</title><body style="font:16px Arial,sans-serif;max-width:560px;margin:12vh auto;padding:24px;color:#18352f">' +
    '<h1>' + title + '</h1><p>' + message + '</p><p>Anda dapat menutup tab ini dan kembali ke website.</p>' +
    '</body></html>'
  );
}
