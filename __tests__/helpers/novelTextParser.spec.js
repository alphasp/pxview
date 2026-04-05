import parseNovelText from '../../src/common/helpers/novelTextParser';
import { renderTextWithInlineImages } from '../../src/common/helpers/novelInlineImage';

describe('parseNovelText inline images', () => {
  it('converts loadedimage markup into a px-image node', () => {
    const result = parseNovelText('before[loadedimage:24095674]after');

    expect(result).toEqual([
      "before<px-image data-illust-id='24095674'></px-image>after",
    ]);
  });

  it('keeps newpage behavior when image markers are present', () => {
    const result = parseNovelText('one[loadedimage:24095674][newpage]two');

    expect(result).toEqual([
      "one<px-image data-illust-id='24095674'></px-image>",
      'two',
    ]);
  });

  it('still escapes less-than characters in plain text output', () => {
    const result = parseNovelText('before<after');

    expect(result).toEqual(['before＜after']);
  });

  it('still escapes less-than characters inside chapter text', () => {
    const result = parseNovelText('before[chapter:Title<test>]after');

    expect(result).toEqual(['before<chapter>Title＜test></chapter>after']);
  });

  it('renders multiple inline images and keeps edge placement intact', () => {
    const result = renderTextWithInlineImages(
      '[loadedimage:1]mid[loadedimage:2]',
    );

    expect(result).toBe(
      "<px-image data-illust-id='1'></px-image>mid<px-image data-illust-id='2'></px-image>",
    );
  });

  it('preserves ruby text inside jumpuri titles', () => {
    const result = parseNovelText(
      '[[jumpuri:[[rb:base>ruby]] > https://example.com]]',
    );

    expect(result).toEqual(["<a href='https://example.com'>base(ruby)</a>"]);
  });
});
