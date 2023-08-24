# XYZ Language Specification
## Introduction
XYZ is a novel web language aimed at simplifying the creation of web components by merging layout, style, and data fetching into a single, intuitive syntax. XYZ aims to reduce the boilerplate and complexity associated with traditional HTML/CSS/JS interactions by providing an integrated approach.

### Basic Components
1. Box: A generic container, analogous to an HTML div.

```
Box('id', {
    styleProperty: value,
    ...
}) {
    // nested components or content
}
```

2. Link: Creates a hyperlink, analogous to an HTML a tag.

```
Link('url') {
    text: "Displayed Text",
    styleProperty: value,
    ...
}
```

### Data Integration
Components in XYZ can directly fetch and display data, abstracting away the need for separate data fetching and templating steps.

* dataUrl: Fetches data from the given URL when the component is rendered.

```
dataUrl: "https://api.example.com/data"
```

* repeat: If set to true, the component will repeat its content for each item in the fetched data array.

```
repeat: true
```

* Data Placeholders: Data fetched from dataUrl can be integrated into the component using placeholders. The syntax for placeholders is {{ dataKey }}, where dataKey corresponds to a key in the fetched data object.

```
text: "Name: {{ name }}"
```

### Sample Usage
Here's an example of a component that fetches user data and displays it as cards:

```
Box('userCard', {
    dataUrl: "https://api.example.com/users",
    repeat: true,
    background: #f5f5f5,
    border: 1px solid #e0e0e0,
    padding: 10px,
    center: true
}) {
    text: "Name: {{ name }}",
    Link('{{ website }}') {
        text: "Visit {{ name }}'s website",
        color: blue
    }
}
```

In this example, the ***Box*** component fetches user data from the provided ***dataUrl*** and then repeats its content for each user, creating a card with the user's name and a link to their website.
