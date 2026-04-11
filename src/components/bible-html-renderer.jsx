import React from 'react';
import { useWindowDimensions, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML, { TNodeRenderer } from 'react-native-render-html';

const classesStyles = {
  // Main Section Headers (e.g. "Account of Creation", "History of Creation")
  s: { fontSize: 24, lineHeight: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 16, fontFamily: 'Inter', textAlign: 'center' },
  s1: { fontSize: 24, lineHeight: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 16, fontFamily: 'Inter', textAlign: 'center' },
  s2: { fontSize: 22, lineHeight: 28, fontWeight: 'bold', marginTop: 12, marginBottom: 16, fontFamily: 'Inter', textAlign: 'center' },
  s3: { fontSize: 20, lineHeight: 28, fontWeight: 'bold', marginTop: 10, marginBottom: 12, fontFamily: 'Inter', textAlign: 'center' },
  s4: { fontSize: 18, lineHeight: 28, fontWeight: 'bold', marginTop: 8, marginBottom: 10, fontFamily: 'Inter', textAlign: 'center' },

  // Descriptive titles 
  d: { fontSize: 24, lineHeight: 32, fontWeight: 'bold', marginTop: 16, marginBottom: 16, fontFamily: 'Inter', textAlign: 'center' },

  // Verse Numbers - Keep small so they don't look like headers
  v: { fontSize: 14, fontWeight: 'bold', opacity: 0.4 },

  // Chapter markers and other noise - Often redundant or too large, so we hide them
  c: { display: 'none' },
  cl: { display: 'none' },
  ca: { display: 'none' },
  r: { display: 'none' }, // Parallel references

  // Content block styling (Standardizing at 18px for better readability)
  p: { fontSize: 18, lineHeight: 28, color: '#334155', marginBottom: 8, fontFamily: 'Inter', textAlign: 'justify' },
  q1: { fontSize: 18, lineHeight: 28, paddingLeft: 24, fontStyle: 'italic', marginBottom: 4, textAlign: 'justify' },
  q2: { fontSize: 18, lineHeight: 28, paddingLeft: 48, fontStyle: 'italic', marginBottom: 4, textAlign: 'justify' },
  m: { fontSize: 18, lineHeight: 28, marginTop: 0, marginBottom: 8, textAlign: 'justify' },

  // Meta tags
  b: { height: 0 }
};

const tagsStyles = {
  p: { fontSize: 18, lineHeight: 28, marginTop: 0, marginBottom: 20, textAlign: 'justify' }
};

export default function BibleHtmlRenderer({
  html,
  colorScheme,
  isTamil,
  highlights = {},
  selectedVerseId = null,
  chapterId = null,
  onVersePress,
  onVerseLongPress
}) {
  const { width } = useWindowDimensions();
  const alignment = isTamil ? 'left' : 'justify';

  // 1. Process HTML: Block Isolation
  const processedHtml = React.useMemo(() => {
    if (!html) return '';
    // Instead of stripping <p>, convert to <div> to keep classes (like s1, s2)
    const preserved = html.replace(/<p/g, '<div').replace(/<\/p>/g, '</div>');
    
    // Use the passed chapterId or attempt to find it from ANY element that has it
    let baseId = chapterId;
    if (!baseId) {
      const allSids = preserved.match(/data-sid="([^"]+)"/g);
      if (allSids) {
        for (const sidStr of allSids) {
          const match = sidStr.match(/"([^"]+)"/);
          if (match) {
            const val = match[1]; // e.g. "GEN 1:1"
            const parts = val.split(/[\s:]+/); // Split by space or colon
            if (parts.length >= 2) {
              baseId = `${parts[0]}.${parts[1]}`;
              break;
            }
          }
        }
      }
    }

    const parts = preserved.split(/(<[^>]+>)/g);
    let currentVerseNum = null;
    let result = '';

    parts.forEach((part, index) => {
      if (part.startsWith('<')) {
        // Detect if this tag IS a header (based on class)
        const isHeader = part.includes('class="s') || part.includes('class="d') || part.startsWith('<div class="s') || part.startsWith('<div class="d');
        const isMeta = part.includes('class="c') || part.includes('class="b') || part.includes('class="r');

        // If we hit a header or meta tag, close the current verse block
        if (isHeader || isMeta) {
          if (currentVerseNum) result += '</div>';
          currentVerseNum = null;
        }

        // Detect Verse Marker
        if (part.includes('class="v"')) {
          const vMatch = parts[index + 1]?.match(/^\s*(\d+)/);
          if (vMatch) {
            if (currentVerseNum) result += `</div>`;
            currentVerseNum = vMatch[1];
            const finalSid = baseId ? `${baseId}.${currentVerseNum}` : `V.${currentVerseNum}`;
            result += `<div class="vblock" data-sid="${finalSid}">`;
          }
        }
        result += part;
      } else {
        result += part;
      }
    });

    if (currentVerseNum) result += '</div>';
    return result;
  }, [html]);

  // 2. Custom Renderers (Verse Blocks)
  const renderers = {
    div: (props) => {
      // ONLY intercept our custom "vblock" - let other divs (headers) use default renderer
      if (!props.tnode.classes?.includes('vblock')) {
        return <props.TDefaultRenderer {...props} />;
      }

      const vId = props.tnode.attributes['data-sid'];
      const isSelected = vId && selectedVerseId === vId;
      const hColor = vId && highlights[vId];

      let txtColor;
      if (hColor) {
        txtColor = '#334155';
      } else {
        txtColor = colorScheme === 'dark' ? '#ffffff' : '#334155';
      }

      return (
        <TouchableOpacity
          onPress={() => vId && onVersePress && onVersePress(vId)}
          onLongPress={() => vId && onVerseLongPress && onVerseLongPress(vId)}
          activeOpacity={0.7}
          style={{
            marginBottom: 2,
            padding: 4, // Reduction for cleaner look
            backgroundColor: hColor || 'transparent',
            borderRadius: 8,
          }}
        >
          <Text style={{
            fontSize: 18, // Balanced size
            lineHeight: 28, // Professional spacing
            color: txtColor,
            textAlign: alignment,
            textDecorationLine: isSelected ? 'underline' : 'none',
            fontWeight: isSelected ? 'bold' : 'normal',
          }}>
            {props.tnode.children.map((child, index) => (
              <TNodeRenderer key={index} tnode={child} />
            ))}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  // 3. Theme Styles with Version-Specific Formatting
  const themeClassesStyles = {
    ...classesStyles,
    // Reduce Header font size for Tamil (IRV) as requested
    s: { ...classesStyles.s, fontSize: isTamil ? 22 : 24, color: colorScheme === 'dark' ? '#ffffff' : '#1a355b' },
    s1: { ...classesStyles.s1, fontSize: isTamil ? 22 : 24, color: colorScheme === 'dark' ? '#ffffff' : '#1a355b' },
    s2: { ...classesStyles.s2, fontSize: isTamil ? 20 : 22, color: colorScheme === 'dark' ? '#ffffff' : '#1a355b' },
    s3: { ...classesStyles.s3, fontSize: isTamil ? 18 : 20, color: colorScheme === 'dark' ? '#ffffff' : '#1a355b' },
    d: { ...classesStyles.d, fontSize: isTamil ? 22 : 24, color: colorScheme === 'dark' ? '#ffffff' : '#1a355b' },

    // Body text colors
    p: { ...classesStyles.p, color: colorScheme === 'dark' ? '#ffffff' : '#334155', textAlign: alignment },
    v: { ...classesStyles.v, color: colorScheme === 'dark' ? '#f97316' : '#1a355b' },
  };

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: processedHtml }}
      classesStyles={themeClassesStyles}
      tagsStyles={{ ...tagsStyles, p: { ...tagsStyles.p, textAlign: alignment, color: colorScheme === 'dark' ? '#ffffff' : '#334155' } }}
      ignoredStyles={['margin']}
      ignoredTags={['a', 'note', 'footnote', 'script']}
      renderers={renderers}
    />
  );
}
