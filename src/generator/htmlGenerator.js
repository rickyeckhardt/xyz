function generateHTML(component, data = {}) {
    const { type, args, properties, body } = component;

    switch (type) {
        case 'Box':
            return `<div id="${args.id}" style="${generateStyles(args.styles)}">${body || ''}</div>`;
        case 'Link':
            const href = args.styles.find(s => s.href)?.href;
            const styles = generateStyles(args.styles, ['href']);
            return `<a id="${args.id}" ${href ? `href="${href}"` : ''} ${styles ? `style="${styles}"` : ''}>${properties?.text || body || ''}</a>`;
        case 'Text':
            let replacedText = replacePlaceholders(properties?.text || '', data);
            return `<p id="${args.id}">${replacedText}</p>`;
        default:
            return '';
    }
}


function replacePlaceholders(text, data) {
    const pattern = /{{\s*(\w+)\s*}}/g;
    return text.replace(pattern, (_, key) => data[key] || _);
}

function generateStyles(styles, omitKeys = []) {
    let styleObject = {};

    if (Array.isArray(styles)) {
        styles.forEach(style => {
            const [key, value] = Object.entries(style)[0];
            styleObject[key] = value;
        });
    } else if (typeof styles === 'object') {
        styleObject = styles;
    }

    return Object.entries(styleObject)
                 .filter(([key]) => !omitKeys.includes(key))
                 .map(([key, value]) => `${key}: ${value}`)
                 .join('; ');
}

function generateBody(body, data) {
    if (!body || typeof body !== 'object') return body || '';
    return body.map(b => {
        if (b.type === 'text' && b.value.includes('{{')) {
            const propName = b.value.replace('{{', '').replace('}}', '');
            return data[propName] || '';
        }
        return generateHTML(b, data);
    }).join('');
}

function wrapWithHTMLPage(content, title = 'Generated Page') {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `;
}

module.exports = { generateHTML, wrapWithHTMLPage };
