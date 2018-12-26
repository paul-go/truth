/**
 * This file lists the unicode ranges for all 
 * unicode character blocks across the entire
 * encoding.
 */

type T = [number, number];
type TUnicodeBlocks = { [blockName: string]: T };

export const UnicodeBlocks: TUnicodeBlocks = Object.freeze({
	"Control character": <T>[0x0000, 0x001F],
	"Basic Latin": <T>[0x0020, 0x007F],
	"Latin-1 Supplement": <T>[0x0080, 0x00FF],
	"Latin Extended-A": <T>[0x0100, 0x017F],
	"Latin Extended-B": <T>[0x0180, 0x024F],
	"IPA Extensions": <T>[0x0250, 0x02AF],
	"Spacing Modifier Letters": <T>[0x02B0, 0x02FF],
	"Combining Diacritical Marks": <T>[0x0300, 0x036F],
	"Greek and Coptic": <T>[0x0370, 0x03FF],
	"Cyrillic": <T>[0x0400, 0x04FF],
	"Cyrillic Supplement": <T>[0x0500, 0x052F],
	"Armenian": <T>[0x0530, 0x058F],
	"Hebrew": <T>[0x0590, 0x05FF],
	"Arabic": <T>[0x0600, 0x06FF],
	"Syriac": <T>[0x0700, 0x074F],
	"Arabic Supplement": <T>[0x0750, 0x077F],
	"Thaana": <T>[0x0780, 0x07BF],
	"NKo": <T>[0x07C0, 0x07FF],
	"Samaritan": <T>[0x0800, 0x083F],
	"Mandaic": <T>[0x0840, 0x085F],
	"Syriac Supplement": <T>[0x0860, 0x086F],
	"Arabic Extended-A": <T>[0x08A0, 0x08FF],
	"Devanagari": <T>[0x0900, 0x097F],
	"Bengali": <T>[0x0980, 0x09FF],
	"Gurmukhi": <T>[0x0A00, 0x0A7F],
	"Gujarati": <T>[0x0A80, 0x0AFF],
	"Oriya": <T>[0x0B00, 0x0B7F],
	"Tamil": <T>[0x0B80, 0x0BFF],
	"Telugu": <T>[0x0C00, 0x0C7F],
	"Kannada": <T>[0x0C80, 0x0CFF],
	"Malayalam": <T>[0x0D00, 0x0D7F],
	"Sinhala": <T>[0x0D80, 0x0DFF],
	"Thai": <T>[0x0E00, 0x0E7F],
	"Lao": <T>[0x0E80, 0x0EFF],
	"Tibetan": <T>[0x0F00, 0x0FFF],
	"Myanmar": <T>[0x1000, 0x109F],
	"Georgian": <T>[0x10A0, 0x10FF],
	"Hangul Jamo": <T>[0x1100, 0x11FF],
	"Ethiopic": <T>[0x1200, 0x137F],
	"Ethiopic Supplement": <T>[0x1380, 0x139F],
	"Cherokee": <T>[0x13A0, 0x13FF],
	"Unified Canadian Aboriginal Syllabics": <T>[0x1400, 0x167F],
	"Ogham": <T>[0x1680, 0x169F],
	"Runic": <T>[0x16A0, 0x16FF],
	"Tagalog": <T>[0x1700, 0x171F],
	"Hanunoo": <T>[0x1720, 0x173F],
	"Buhid": <T>[0x1740, 0x175F],
	"Tagbanwa": <T>[0x1760, 0x177F],
	"Khmer": <T>[0x1780, 0x17FF],
	"Mongolian": <T>[0x1800, 0x18AF],
	"Unified Canadian Aboriginal Syllabics Extended": <T>[0x18B0, 0x18FF],
	"Limbu": <T>[0x1900, 0x194F],
	"Tai Le": <T>[0x1950, 0x197F],
	"New Tai Lue": <T>[0x1980, 0x19DF],
	"Khmer Symbols": <T>[0x19E0, 0x19FF],
	"Buginese": <T>[0x1A00, 0x1A1F],
	"Tai Tham": <T>[0x1A20, 0x1AAF],
	"Combining Diacritical Marks Extended": <T>[0x1AB0, 0x1AFF],
	"Balinese": <T>[0x1B00, 0x1B7F],
	"Sundanese": <T>[0x1B80, 0x1BBF],
	"Batak": <T>[0x1BC0, 0x1BFF],
	"Lepcha": <T>[0x1C00, 0x1C4F],
	"Ol Chiki": <T>[0x1C50, 0x1C7F],
	"Cyrillic Extended C": <T>[0x1C80, 0x1C8F],
	"Sundanese Supplement": <T>[0x1CC0, 0x1CCF],
	"Vedic Extensions": <T>[0x1CD0, 0x1CFF],
	"Phonetic Extensions": <T>[0x1D00, 0x1D7F],
	"Phonetic Extensions Supplement": <T>[0x1D80, 0x1DBF],
	"Combining Diacritical Marks Supplement": <T>[0x1DC0, 0x1DFF],
	"Latin Extended Additional": <T>[0x1E00, 0x1EFF],
	"Greek Extended": <T>[0x1F00, 0x1FFF],
	"General Punctuation": <T>[0x2000, 0x206F],
	"Superscripts and Subscripts": <T>[0x2070, 0x209F],
	"Currency Symbols": <T>[0x20A0, 0x20CF],
	"Combining Diacritical Marks for Symbols": <T>[0x20D0, 0x20FF],
	"Letterlike Symbols": <T>[0x2100, 0x214F],
	"Number Forms": <T>[0x2150, 0x218F],
	"Arrows": <T>[0x2190, 0x21FF],
	"Mathematical Operators": <T>[0x2200, 0x22FF],
	"Miscellaneous Technical": <T>[0x2300, 0x23FF],
	"Control Pictures": <T>[0x2400, 0x243F],
	"Optical Character Recognition": <T>[0x2440, 0x245F],
	"Enclosed Alphanumerics": <T>[0x2460, 0x24FF],
	"Box Drawing": <T>[0x2500, 0x257F],
	"Block Elements": <T>[0x2580, 0x259F],
	"Geometric Shapes": <T>[0x25A0, 0x25FF],
	"Miscellaneous Symbols": <T>[0x2600, 0x26FF],
	"Dingbats": <T>[0x2700, 0x27BF],
	"Miscellaneous Mathematical Symbols-A": <T>[0x27C0, 0x27EF],
	"Supplemental Arrows-A": <T>[0x27F0, 0x27FF],
	"Braille Patterns": <T>[0x2800, 0x28FF],
	"Supplemental Arrows-B": <T>[0x2900, 0x297F],
	"Miscellaneous Mathematical Symbols-B": <T>[0x2980, 0x29FF],
	"Supplemental Mathematical Operators": <T>[0x2A00, 0x2AFF],
	"Miscellaneous Symbols and Arrows": <T>[0x2B00, 0x2BFF],
	"Glagolitic": <T>[0x2C00, 0x2C5F],
	"Latin Extended-C": <T>[0x2C60, 0x2C7F],
	"Coptic": <T>[0x2C80, 0x2CFF],
	"Georgian Supplement": <T>[0x2D00, 0x2D2F],
	"Tifinagh": <T>[0x2D30, 0x2D7F],
	"Ethiopic Extended": <T>[0x2D80, 0x2DDF],
	"Cyrillic Extended-A": <T>[0x2DE0, 0x2DFF],
	"Supplemental Punctuation": <T>[0x2E00, 0x2E7F],
	"CJK Radicals Supplement": <T>[0x2E80, 0x2EFF],
	"Kangxi Radicals": <T>[0x2F00, 0x2FDF],
	"Ideographic Description Characters": <T>[0x2FF0, 0x2FFF],
	"CJK Symbols and Punctuation": <T>[0x3000, 0x303F],
	"Hiragana": <T>[0x3040, 0x309F],
	"Katakana": <T>[0x30A0, 0x30FF],
	"Bopomofo": <T>[0x3100, 0x312F],
	"Hangul Compatibility Jamo": <T>[0x3130, 0x318F],
	"Kanbun": <T>[0x3190, 0x319F],
	"Bopomofo Extended": <T>[0x31A0, 0x31BF],
	"CJK Strokes": <T>[0x31C0, 0x31EF],
	"Katakana Phonetic Extensions": <T>[0x31F0, 0x31FF],
	"Enclosed CJK Letters and Months": <T>[0x3200, 0x32FF],
	"CJK Compatibility": <T>[0x3300, 0x33FF],
	"CJK Unified Ideographs Extension A": <T>[0x3400, 0x4DBF],
	"Yijing Hexagram Symbols": <T>[0x4DC0, 0x4DFF],
	"CJK Unified Ideographs": <T>[0x4E00, 0x9FFF],
	"Yi Syllables": <T>[0xA000, 0xA48F],
	"Yi Radicals": <T>[0xA490, 0xA4CF],
	"Lisu": <T>[0xA4D0, 0xA4FF],
	"Vai": <T>[0xA500, 0xA63F],
	"Cyrillic Extended-B": <T>[0xA640, 0xA69F],
	"Bamum": <T>[0xA6A0, 0xA6FF],
	"Modifier Tone Letters": <T>[0xA700, 0xA71F],
	"Latin Extended-D": <T>[0xA720, 0xA7FF],
	"Syloti Nagri": <T>[0xA800, 0xA82F],
	"Common Indic Number Forms": <T>[0xA830, 0xA83F],
	"Phags-pa": <T>[0xA840, 0xA87F],
	"Saurashtra": <T>[0xA880, 0xA8DF],
	"Devanagari Extended": <T>[0xA8E0, 0xA8FF],
	"Kayah Li": <T>[0xA900, 0xA92F],
	"Rejang": <T>[0xA930, 0xA95F],
	"Hangul Jamo Extended-A": <T>[0xA960, 0xA97F],
	"Javanese": <T>[0xA980, 0xA9DF],
	"Myanmar Extended-B": <T>[0xA9E0, 0xA9FF],
	"Cham": <T>[0xAA00, 0xAA5F],
	"Myanmar Extended-A": <T>[0xAA60, 0xAA7F],
	"Tai Viet": <T>[0xAA80, 0xAADF],
	"Meetei Mayek Extensions": <T>[0xAAE0, 0xAAFF],
	"Ethiopic Extended-A": <T>[0xAB00, 0xAB2F],
	"Latin Extended-E": <T>[0xAB30, 0xAB6F],
	"Cherokee Supplement": <T>[0xAB70, 0xABBF],
	"Meetei Mayek": <T>[0xABC0, 0xABFF],
	"Hangul Syllables": <T>[0xAC00, 0xD7AF],
	"Hangul Jamo Extended-B": <T>[0xD7B0, 0xD7FF],
	"High Surrogates": <T>[0xD800, 0xDB7F],
	"High Private Use Surrogates": <T>[0xDB80, 0xDBFF],
	"Low Surrogates": <T>[0xDC00, 0xDFFF],
	"Private Use Area": <T>[0xE000, 0xF8FF],
	"CJK Compatibility Ideographs": <T>[0xF900, 0xFAFF],
	"Alphabetic Presentation Forms": <T>[0xFB00, 0xFB4F],
	"Arabic Presentation Forms-A": <T>[0xFB50, 0xFDFF],
	"Variation Selectors": <T>[0xFE00, 0xFE0F],
	"Vertical Forms": <T>[0xFE10, 0xFE1F],
	"Combining Half Marks": <T>[0xFE20, 0xFE2F],
	"CJK Compatibility Forms": <T>[0xFE30, 0xFE4F],
	"Small Form Variants": <T>[0xFE50, 0xFE6F],
	"Arabic Presentation Forms-B": <T>[0xFE70, 0xFEFF],
	"Halfwidth and Fullwidth Forms": <T>[0xFF00, 0xFFEF],
	"Specials": <T>[0xFFF0, 0xFFFF],
	"Linear B Syllabary": <T>[0x10000, 0x1007F],
	"Linear B Ideograms": <T>[0x10080, 0x100FF],
	"Aegean Numbers": <T>[0x10100, 0x1013F],
	"Ancient Greek Numbers": <T>[0x10140, 0x1018F],
	"Ancient Symbols": <T>[0x10190, 0x101CF],
	"Phaistos Disc": <T>[0x101D0, 0x101FF],
	"Lycian": <T>[0x10280, 0x1029F],
	"Carian": <T>[0x102A0, 0x102DF],
	"Coptic Epact Numbers": <T>[0x102E0, 0x102FF],
	"Old Italic": <T>[0x10300, 0x1032F],
	"Gothic": <T>[0x10330, 0x1034F],
	"Old Permic": <T>[0x10350, 0x1037F],
	"Ugaritic": <T>[0x10380, 0x1039F],
	"Old Persian": <T>[0x103A0, 0x103DF],
	"Deseret": <T>[0x10400, 0x1044F],
	"Shavian": <T>[0x10450, 0x1047F],
	"Osmanya": <T>[0x10480, 0x104AF],
	"Osage": <T>[0x104B0, 0x104FF],
	"Elbasan": <T>[0x10500, 0x1052F],
	"Caucasian Albanian": <T>[0x10530, 0x1056F],
	"Linear A": <T>[0x10600, 0x1077F],
	"Cypriot Syllabary": <T>[0x10800, 0x1083F],
	"Imperial Aramaic": <T>[0x10840, 0x1085F],
	"Palmyrene": <T>[0x10860, 0x1087F],
	"Nabataean": <T>[0x10880, 0x108AF],
	"Hatran": <T>[0x108E0, 0x108FF],
	"Phoenician": <T>[0x10900, 0x1091F],
	"Lydian": <T>[0x10920, 0x1093F],
	"Meroitic Hieroglyphs": <T>[0x10980, 0x1099F],
	"Meroitic Cursive": <T>[0x109A0, 0x109FF],
	"Kharoshthi": <T>[0x10A00, 0x10A5F],
	"Old South Arabian": <T>[0x10A60, 0x10A7F],
	"Old North Arabian": <T>[0x10A80, 0x10A9F],
	"Manichaean": <T>[0x10AC0, 0x10AFF],
	"Avestan": <T>[0x10B00, 0x10B3F],
	"Inscriptional Parthian": <T>[0x10B40, 0x10B5F],
	"Inscriptional Pahlavi": <T>[0x10B60, 0x10B7F],
	"Psalter Pahlavi": <T>[0x10B80, 0x10BAF],
	"Old Turkic": <T>[0x10C00, 0x10C4F],
	"Old Hungarian": <T>[0x10C80, 0x10CFF],
	"Rumi Numeral Symbols": <T>[0x10E60, 0x10E7F],
	"Brahmi": <T>[0x11000, 0x1107F],
	"Kaithi": <T>[0x11080, 0x110CF],
	"Sora Sompeng": <T>[0x110D0, 0x110FF],
	"Chakma": <T>[0x11100, 0x1114F],
	"Mahajani": <T>[0x11150, 0x1117F],
	"Sharada": <T>[0x11180, 0x111DF],
	"Sinhala Archaic Numbers": <T>[0x111E0, 0x111FF],
	"Khojki": <T>[0x11200, 0x1124F],
	"Multani": <T>[0x11280, 0x112AF],
	"Khudawadi": <T>[0x112B0, 0x112FF],
	"Grantha": <T>[0x11300, 0x1137F],
	"Newa": <T>[0x11400, 0x1147F],
	"Tirhuta": <T>[0x11480, 0x114DF],
	"Siddham": <T>[0x11580, 0x115FF],
	"Modi": <T>[0x11600, 0x1165F],
	"Mongolian Supplement": <T>[0x11660, 0x1167F],
	"Takri": <T>[0x11680, 0x116CF],
	"Ahom": <T>[0x11700, 0x1173F],
	"Warang Citi": <T>[0x118A0, 0x118FF],
	"Zanabazar Square": <T>[0x11A00, 0x11A4F],
	"Soyombo": <T>[0x11A50, 0x11AAF],
	"Pau Cin Hau": <T>[0x11AC0, 0x11AFF],
	"Bhaiksuki": <T>[0x11C00, 0x11C6F],
	"Marchen": <T>[0x11C70, 0x11CBF],
	"Masaram Gondi": <T>[0x11D00, 0x11D5F],
	"Cuneiform": <T>[0x12000, 0x123FF],
	"Cuneiform Numbers and Punctuation": <T>[0x12400, 0x1247F],
	"Early Dynastic Cuneiform": <T>[0x12480, 0x1254F],
	"Egyptian Hieroglyphs": <T>[0x13000, 0x1342F],
	"Anatolian Hieroglyphs": <T>[0x14400, 0x1467F],
	"Bamum Supplement": <T>[0x16800, 0x16A3F],
	"Mro": <T>[0x16A40, 0x16A6F],
	"Bassa Vah": <T>[0x16AD0, 0x16AFF],
	"Pahawh Hmong": <T>[0x16B00, 0x16B8F],
	"Miao": <T>[0x16F00, 0x16F9F],
	"Ideographic Symbols and Punctuation": <T>[0x16FE0, 0x16FFF],
	"Tangut": <T>[0x17000, 0x187FF],
	"Tangut Components": <T>[0x18800, 0x18AFF],
	"Kana Supplement": <T>[0x1B000, 0x1B0FF],
	"Kana Extended-A": <T>[0x1B100, 0x1B12F],
	"Nushu": <T>[0x1B170, 0x1B2FF],
	"Duployan": <T>[0x1BC00, 0x1BC9F],
	"Shorthand Format Controls": <T>[0x1BCA0, 0x1BCAF],
	"Byzantine Musical Symbols": <T>[0x1D000, 0x1D0FF],
	"Musical Symbols": <T>[0x1D100, 0x1D1FF],
	"Ancient Greek Musical Notation": <T>[0x1D200, 0x1D24F],
	"Tai Xuan Jing Symbols": <T>[0x1D300, 0x1D35F],
	"Counting Rod Numerals": <T>[0x1D360, 0x1D37F],
	"Mathematical Alphanumeric Symbols": <T>[0x1D400, 0x1D7FF],
	"Sutton SignWriting": <T>[0x1D800, 0x1DAAF],
	"Glagolitic Supplement": <T>[0x1E000, 0x1E02F],
	"Mende Kikakui": <T>[0x1E800, 0x1E8DF],
	"Adlam": <T>[0x1E900, 0x1E95F],
	"Arabic Mathematical Alphabetic Symbols": <T>[0x1EE00, 0x1EEFF],
	"Mahjong Tiles": <T>[0x1F000, 0x1F02F],
	"Domino Tiles": <T>[0x1F030, 0x1F09F],
	"Playing Cards": <T>[0x1F0A0, 0x1F0FF],
	"Enclosed Alphanumeric Supplement": <T>[0x1F100, 0x1F1FF],
	"Enclosed Ideographic Supplement": <T>[0x1F200, 0x1F2FF],
	"Miscellaneous Symbols and Pictographs": <T>[0x1F300, 0x1F5FF],
	"Emoticons (Emoji)": <T>[0x1F600, 0x1F64F],
	"Ornamental Dingbats": <T>[0x1F650, 0x1F67F],
	"Transport and Map Symbols": <T>[0x1F680, 0x1F6FF],
	"Alchemical Symbols": <T>[0x1F700, 0x1F77F],
	"Geometric Shapes Extended": <T>[0x1F780, 0x1F7FF],
	"Supplemental Arrows-C": <T>[0x1F800, 0x1F8FF],
	"Supplemental Symbols and Pictographs": <T>[0x1F900, 0x1F9FF],
	"CJK Unified Ideographs Extension B": <T>[0x20000, 0x2A6DF],
	"CJK Unified Ideographs Extension C": <T>[0x2A700, 0x2B73F],
	"CJK Unified Ideographs Extension D": <T>[0x2B740, 0x2B81F],
	"CJK Unified Ideographs Extension E": <T>[0x2B820, 0x2CEAF],
	"CJK Unified Ideographs Extension F": <T>[0x2CEB0, 0x2EBEF],
	"CJK Compatibility Ideographs Supplement": <T>[0x2F800, 0x2FA1F],
	"Tags": <T>[0xE0000, 0xE007F],
	"Variation Selectors Supplement": <T>[0xE0100, 0xE01EF]
});


/**
 * Stores the maximum character code in the unicode set.
 */
export const UnicodeMax = 65536;