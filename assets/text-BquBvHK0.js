import{i as e,o as t,r as n}from"./index-BI8FQMgX.js";var r=t(n(),1);function i({src:t,alt:n,title:i,caption:a,className:o}){return(0,r.jsxs)(`figure`,{className:e(`w-full h-auto rounded-md border border-border/20`,o),children:[i&&(0,r.jsx)(`h3`,{className:`text-sectionTitle`,children:i}),(0,r.jsx)(`img`,{src:t,alt:n,className:`rounded-md object-cover w-full`}),a&&(0,r.jsx)(`figcaption`,{className:`text-tiny`,children:a})]})}function a({code:t,className:n}){return(0,r.jsx)(`pre`,{className:e(`
        bg-muted text-muted-foreground
        font-mono text-sm
        leading-relaxed
        rounded-md
        px-md py-md
        overflow-x-auto
        border border-border/20
        `,n),children:(0,r.jsx)(`code`,{children:t})})}function o({title:t,heading:n,lead:o,code:s,content:c,quote:l,bullets:u,image:d,className:f}){return(0,r.jsxs)(`section`,{className:e(`flex flex-col gap-md`,f),children:[t&&(0,r.jsx)(`h2`,{className:`text-pageTitle`,children:t}),n&&(0,r.jsx)(`h3`,{className:`text-sectionTitle`,children:n}),o&&(0,r.jsx)(`p`,{className:`text-lead`,children:o}),l&&(0,r.jsx)(`blockquote`,{className:`pl-md border-l-4 border-muted text-body italic opacity-80`,children:l}),c&&(0,r.jsx)(`p`,{className:`text-body`,children:c}),s&&(0,r.jsx)(a,{code:s}),u?.length?(0,r.jsx)(`ul`,{className:`list-disc list-outside pl-lg flex flex-col gap-sm`,children:u.map((e,t)=>(0,r.jsx)(`li`,{className:`text-body`,children:e},t))}):null,d&&(0,r.jsx)(i,{src:d.src,alt:d.alt??``,className:d.className})]})}export{i as n,o as t};