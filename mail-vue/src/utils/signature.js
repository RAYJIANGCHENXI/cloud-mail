function escapeHtml(value = '') {
    return value.replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
}

export function signatureHtml(signature, email, origin) {
    if (!signature?.enabled) return '';
    const lines = [
        '<a href="https://www.infotrekx.com" style="color:#111;text-decoration:none">www.infotrekx.com</a>',
        escapeHtml(signature.title),
        escapeHtml(signature.name),
        `Email: <a href="mailto:${escapeHtml(email)}" style="color:#111;text-decoration:none">${escapeHtml(email)}</a>`,
        signature.phone ? `Cell: ${escapeHtml(signature.phone)}` : '',
        escapeHtml(signature.address),
    ].filter(Boolean);
    return `<div data-infotrekx-signature="1" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#111;max-width:620px">
        <div style="margin-bottom:10px"><a href="https://www.infotrekx.com"><img src="${origin}/image/infotrekx-signature-logo.png" alt="INFOTREKX" width="300" style="display:block;width:300px;max-width:100%;height:auto;border:0"></a></div>
        ${lines.map(line => `<div>${line}</div>`).join('')}
    </div>`;
}

export function addSignature(content, signature, email, origin) {
    const html = signatureHtml(signature, email, origin);
    return html ? `<div><br></div>${html}<div><br></div>${content}` : content;
}
