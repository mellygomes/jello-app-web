// <<<<<<< HEAD:src/components/Filter/TagSelect.jsx
// // Movi este componente para os componentes globais para ser reutilizado
// // =======
// import { Select, Tag } from "antd";
// import { useTags } from "../../../hooks";
// >>>>>>> 2b4b884bd07ff68d8be36f5353a97690c03ee19c:src/components/Filter/TagSelect/TagSelect.jsx

// import { Select, Tag } from "antd";
// import { useTags } from "../../hooks/useTags.js";

// export default function TagSelect({ onChange, value }) {

//     const {tags} = useTags();

//     const selectOptions = tags.map((tag) => ({
//         label: tag.name,
//         value: tag.id,
//         color: tag.color,
//     }));

//     const tagRender = (props) => {
//         const {label, value, closable, onClose} = props;
//         const tagData = selectOptions.find((opt) => opt.value === value);
//         const color = tagData ? tagData.color : undefined;

//         return (
//             <Tag
//                 key={value}
//                 color={color}
//                 closable={closable}
//                 onClose={onClose}
//                 style={{marginInlineEnd: 4}}
//             >
//                 {label}
//             </Tag>
//         );
//     };

//     return (
//         <Select
//             mode="multiple"
//             tagRender={tagRender}
//             placeholder="Selecione as tags"
//             style={{width: '100%'}}
//             options={selectOptions}
//             onChange={onChange}
//             value={value}
//         />
//     );
// }