start
  = component

component
  = name:("Box" / "Link" / "Text") _ "(" _ args:arguments _ ")" _ properties:properties? _ body:componentBody? { 
      return { type: name, args, properties, body }; 
    }

arguments
  = id:quotedString _ "," _ styles:objectProperties { 
      const dataUrlProperty = styles.find(style => style.dataUrl);
      if (dataUrlProperty) {
        return { id, styles: styles.filter(style => !style.dataUrl), dataUrl: dataUrlProperty.dataUrl }; 
      }
      return { id, styles };
    }
  / id:quotedString { return { id }; }
  / url:quotedString { return { url }; }

properties
  = "{" _ properties:property? _ "}" { return properties; }

objectProperties
  = "{" _ properties:(property _ ","? _)* "}" { 
      return properties.map(p => p[0]); 
  }

property
  = key:identifier _ ":" _ value:value _ ","? { return { [key]: value }; }

componentBody
  = "{" _ body:(component / content)* _ "}" { return body; }

content
  = "text:" _ text:templateString _ ","? { return { type: 'text', value: text }; }

identifier
  = ([a-zA-Z_-]+) { return text(); }

quotedString
  = "'" chars:[^']* "'" { return chars.join(''); }

templateString
  = "'" chars:(normalChar / templateChar)* "'" { return chars.join(''); }

normalChar
  = [^'{}]

templateChar
  = "{{" _ content:identifier _ "}}" { return "{{" + content + "}}"; }

value
  = quotedString
  / identifier

_ "whitespace"
  = [ \t\n\r]*