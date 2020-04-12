import { Parser as NovelParser } from 'pixiv-novel-parser';

const parseNovelText = (novelText) => {
  // const parsedNovelText = NovelParser.parse(
  //   `${novelText
  //     .text}[jump:2]blabla[[jumpuri:とある[[rb: 魔術 > まじゅつ]]の[[rb:禁書目録>インデックス]] > http://www.project-index.net/]]`,
  // );
  const parsedNovelText = NovelParser.parse(novelText);
  const items = [];
  let text = '';
  parsedNovelText.forEach((p, index) => {
    if (p.type === 'text') {
      text += p.val.replace(/</g, '＜');
    } else if (p.type === 'tag') {
      if (p.name === 'chapter') {
        text += '<chapter>';
        p.title.forEach((pp) => {
          if (pp.type === 'text') {
            text += pp.val.replace(/</g, '＜');
          } else if (pp.name === 'rb') {
            text += `${pp.rubyBase}(${pp.rubyText})`;
          }
        });
        text += '</chapter>';
      } else if (p.name === 'rb') {
        text += `${p.rubyBase}(${p.rubyText})`;
      } else if (p.name === 'jump') {
        text += `<jump page=${p.pageNumber}>${p.pageNumber}ページへ</jump>`;
      } else if (p.name === 'jumpuri') {
        text += `<a href='${p.uri}'>`;
        p.title.forEach((pp) => {
          if (pp.type === 'text') {
            text += pp.val.replace(/</g, '＜');
          } else if (pp.type === 'rb') {
            text += `${pp.rubyBase}(${pp.rubyText})`;
          }
        });
        text += '</a>';
      } else if (p.name === 'newpage') {
        items.push(text);
        text = '';
      }
    }
    // if this is last item and no new page tag
    if (
      index === parsedNovelText.length - 1 &&
      (!items.length || p.name !== 'newpage')
    ) {
      items.push(text);
    }
  });
  return items;
};

export default parseNovelText;
