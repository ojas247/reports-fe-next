// // components/A2UISurface.jsx
// function toComponentArray(components) {
//   if (Array.isArray(components)) return components;
//   if (components instanceof Map) return Array.from(components.values());
//   if (components && typeof components === 'object') return Object.values(components);
//   return [];
// }

// export default function A2UISurface({ surface, onAction, surfaceId }) {
//   const components = toComponentArray(surface?.components);

//   return (
//     <div data-surface-id={surfaceId}>
//       {components.map((comp) => (
//         <A2UIComponent
//           key={comp.id}
//           component={comp}
//           onAction={(action) => onAction(action, surfaceId)}
//         />
//       ))}
//     </div>
//   );
// }

// function A2UIComponent({ component, onAction }) {
//   const { id, component: def } = component;

//   if (def?.Text) {
//     const { usageHint, text } = def.Text;
//     const content = text?.literalString ?? '';

//     const Tag = usageHint === 'heading' ? 'h2'
//               : usageHint === 'body'    ? 'p'
//               : 'span';

//     return <Tag id={id}>{content}</Tag>;
//   }

//   if (def?.Button) {
//     return (
//       <button
//         id={id}
//         onClick={() => onAction({
//           name: def.Button.action?.name,
//           sourceComponentId: id,
//           context: def.Button.action?.context
//         })}
//       >
//         {def.Button.label?.literalString ?? 'Click'}
//       </button>
//     );
//   }

//   if (def?.InsightCard) {
//     return (
//       <div id={id} className="insight-card">
//         <h3>{def.InsightCard.properties?.title}</h3>
//         {def.InsightCard.properties?.loading && <div className="spinner" />}
//       </div>
//     );
//   }

//   console.warn('Unknown A2UI component type:', def);
//   return null;
// }