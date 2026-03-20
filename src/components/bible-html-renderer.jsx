import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

const classesStyles = {
  s1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    color: '#1a355b',
    marginTop: 0,
    marginBottom: 20,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  p: {
    fontSize: 19,
    lineHeight: 32,
    color: '#334155',
    marginBottom: 8,
    fontFamily: 'Inter',
    textAlign: 'justify',
  },
  v: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1a355b',
    opacity: 0.6,
  },
  q1: {
    fontSize: 19,
    lineHeight: 28,
    paddingLeft: 24,
    fontStyle: 'italic',
    marginBottom: 4,
    textAlign: 'justify',
  },
  q2: {
    fontSize: 19,
    lineHeight: 40,
    paddingLeft: 48,
    fontStyle: 'italic',
    marginBottom: 4,
    textAlign: 'justify',
  },
  m: {
    fontSize: 19,
    lineHeight: 32,
    marginTop: 0,
    marginBottom: 8,
    textAlign: 'justify',
  },
  b: {
    height: 0,
  }
};

const tagsStyles = {
  p: {
    fontSize: 19,
    lineHeight: 30,
    marginTop: 0,
    marginBottom: 20,
    textAlign: 'justify',
  }
};

export default function BibleHtmlRenderer({ html, colorScheme }) {
  const { width } = useWindowDimensions();

  // Add non-breaking spaces after verse elements since inline margins often fail in React Native
  const processedHtml = html ? html.replace(/(<[^>]+class="v"[^>]*>.*?<\/[^>]+>)/g, '$1&nbsp;') : '';

  // Adjust styles based on color scheme
  const themeClassesStyles = {
    ...classesStyles,
    p: {
      ...classesStyles.p,
      color: colorScheme === 'dark' ? '#ffffff' : '#334155',
    },
    q1: {
      ...classesStyles.q1,
      color: colorScheme === 'dark' ? '#ffffff' : '#334155',
    },
    q2: {
      ...classesStyles.q2,
      color: colorScheme === 'dark' ? '#ffffff' : '#334155',
    },
    m: {
      ...classesStyles.m,
      color: colorScheme === 'dark' ? '#ffffff' : '#334155',
    },
    s1: {
      ...classesStyles.s1,
      color: colorScheme === 'dark' ? '#ffffff' : '#1a355b',
    },
    v: {
      ...classesStyles.v,
      color: colorScheme === 'dark' ? '#f97316' : '#1a355b', // accent in dark mode
    }
  };

  const themeTagsStyles = {
    ...tagsStyles,
    p: {
      ...tagsStyles.p,
      color: colorScheme === 'dark' ? '#ffffff' : '#334155',
    }
  };

  const ignoredTags = ['a', 'note', 'footnote', 'script'];

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: processedHtml }}
      classesStyles={themeClassesStyles}
      tagsStyles={themeTagsStyles}
      ignoredTags={ignoredTags}
      baseStyle={{ color: colorScheme === 'dark' ? '#ffffff' : '#334155' }}
    />
  );
}
