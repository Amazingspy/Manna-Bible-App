import React, { useMemo, useCallback } from 'react';
import { useWindowDimensions, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
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
  p: { fontSize: 18, lineHeight: 28, color: '#334155', marginBottom: 8, fontFamily: 'Inter', textAlign: 'left' },
  q1: { fontSize: 18, lineHeight: 28, paddingLeft: 24, fontStyle: 'italic', marginBottom: 4, textAlign: 'left' },
  q2: { fontSize: 18, lineHeight: 28, paddingLeft: 48, fontStyle: 'italic', marginBottom: 4, textAlign: 'left' },
  m: { fontSize: 18, lineHeight: 28, marginTop: 0, marginBottom: 8, textAlign: 'left' },

  // Meta tags
  b: { height: 0 }
};

const tagsStyles = {
  p: { fontSize: 18, lineHeight: 28, marginTop: 0, marginBottom: 20, textAlign: 'left' }
};

// Isolated pure memoized item to prevent full html tree re-renders when a verse is tapped
const VerseBlock = React.memo(({
  tnode,
  vId,
  isSelected,
  hColor,
  colorScheme,
  alignment,
  onVersePress,
  onVerseLongPress,
  onVerseLayout,
  TDefaultRenderer
}) => {
  const handleLayout = useCallback((event) => {
    if (vId && onVerseLayout) {
      onVerseLayout(vId, event.nativeEvent.layout.y);
    }
  }, [vId, onVerseLayout]);

  const handlePress = useCallback(() => {
    if (vId && onVersePress) {
      onVersePress(vId);
    }
  }, [vId, onVersePress]);

  const handleLongPress = useCallback(() => {
    if (vId && onVerseLongPress) {
      onVerseLongPress(vId);
    }
  }, [vId, onVerseLongPress]);

  let txtColor;
  if (hColor) {
    txtColor = '#334155';
  } else {
    txtColor = colorScheme === 'dark' ? '#ffffff' : '#334155';
  }

  return (
    <TouchableOpacity
      onLayout={handleLayout}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      style={{
        marginBottom: 2,
        padding: 4,
        backgroundColor: hColor || 'transparent',
        borderRadius: 8,
      }}
    >
      <View pointerEvents="none">
        <Text style={{
          fontSize: 18,
          lineHeight: 28,
          color: txtColor,
          textAlign: alignment,
          textDecorationLine: isSelected ? 'underline' : 'none',
          fontWeight: isSelected ? 'bold' : 'normal',
        }}>
          {tnode.children.map((child, index) => (
            <TNodeRenderer key={child.id || index} tnode={child} />
          ))}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default function BibleHtmlRenderer({
  html,
  colorScheme,
  isTamil,
  highlights = {},
  selectedVerseId = null,
  chapterId = null,
  onVersePress,
  onVerseLongPress,
  onVerseLayout
}) {
  const { width } = useWindowDimensions();
  const alignment = isTamil ? 'left' : 'left';

  // 1. Process HTML: Preserve your exact original parsing algorithm, memoized efficiently
  const processedHtml = useMemo(() => {
    if (!html) return '';
    const preserved = html.replace(/<p/g, '<div').replace(/<\/p>/g, '</div>');

    let baseId = chapterId;
    if (!baseId) {
      const allSids = preserved.match(/data-sid="([^"]+)"/g);
      if (allSids) {
        for (const sidStr of allSids) {
          const match = sidStr.match(/"([^"]+)"/);
          if (match) {
            const val = match[1];
            const parts = val.split(/[\s:]+/);
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
        const isHeader = part.includes('class="s') || part.includes('class="d') || part.startsWith('<div class="s') || part.startsWith('<div class="d');
        const isMeta = part.includes('class="c') || part.includes('class="b') || part.includes('class="r');

        if (isHeader || isMeta) {
          if (currentVerseNum) result += '</div>';
          currentVerseNum = null;
        }

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
  }, [html, chapterId]);

  // 2. Custom Renderers (Verse Blocks) memoized to avoid re-creation lag
  const renderers = useMemo(() => ({
    div: (props) => {
      if (!props.tnode.classes?.includes('vblock')) {
        return <props.TDefaultRenderer {...props} />;
      }

      const vId = props.tnode.attributes['data-sid'];
      const isSelected = vId && selectedVerseId === vId;
      const hColor = vId && highlights[vId];

      return (
        <VerseBlock
          tnode={props.tnode}
          vId={vId}
          isSelected={isSelected}
          hColor={hColor}
          colorScheme={colorScheme}
          alignment={alignment}
          onVersePress={onVersePress}
          onVerseLongPress={onVerseLongPress}
          onVerseLayout={onVerseLayout}
          TDefaultRenderer={props.TDefaultRenderer}
        />
      );
    }
  }), [selectedVerseId, highlights, colorScheme, alignment, onVersePress, onVerseLongPress, onVerseLayout]);

  // 3. Theme Styles Memoized
  const themeClassesStyles = useMemo(() => ({
    ...classesStyles,
    s: { ...classesStyles.s, fontSize: isTamil ? 22 : 24, color: colorScheme === 'dark' ? '#f1f5f9' : '#1a355b' },
    s1: { ...classesStyles.s1, fontSize: isTamil ? 22 : 24, color: colorScheme === 'dark' ? '#f1f5f9' : '#1a355b' },
    s2: { ...classesStyles.s2, fontSize: isTamil ? 20 : 22, color: colorScheme === 'dark' ? '#f1f5f9' : '#1a355b' },
    s3: { ...classesStyles.s3, fontSize: isTamil ? 18 : 20, color: colorScheme === 'dark' ? '#f1f5f9' : '#1a355b' },
    d: { ...classesStyles.d, fontSize: isTamil ? 22 : 24, color: colorScheme === 'dark' ? '#f1f5f9' : '#1a355b' },

    p: { ...classesStyles.p, color: colorScheme === 'dark' ? '#f8fafc' : '#334155', textAlign: alignment },
    q1: { ...classesStyles.q1, color: colorScheme === 'dark' ? '#f8fafc' : '#334155', textAlign: alignment },
    q2: { ...classesStyles.q2, color: colorScheme === 'dark' ? '#f8fafc' : '#334155', textAlign: alignment },
    m: { ...classesStyles.m, color: colorScheme === 'dark' ? '#f8fafc' : '#334155', textAlign: alignment },
    v: { ...classesStyles.v, color: colorScheme === 'dark' ? '#f97316' : '#1a355b' },
  }), [colorScheme, isTamil, alignment]);

  const themeTagsStyles = useMemo(() => ({
    ...tagsStyles,
    p: { ...tagsStyles.p, textAlign: alignment, color: colorScheme === 'dark' ? '#f8fafc' : '#334155' },
    div: { textAlign: alignment, color: colorScheme === 'dark' ? '#f8fafc' : '#334155' }
  }), [colorScheme, alignment]);

  const baseStyle = useMemo(() => ({
    color: colorScheme === 'dark' ? '#f8fafc' : '#334155',
    fontSize: 18,
    lineHeight: 28,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter',
    textAlign: alignment
  }), [colorScheme, alignment]);

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: processedHtml }}
      baseStyle={baseStyle}
      classesStyles={themeClassesStyles}
      tagsStyles={themeTagsStyles}
      ignoredStyles={['margin']}
      ignoredTags={['a', 'note', 'footnote', 'script']}
      renderers={renderers}
    />
  );
}