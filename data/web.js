// data/web.js —— 由 tools/build.mjs 从《Web题库.md》自动生成，请勿手改。
// 改完题库后重新运行：node tools/build.mjs
window.QUIZ_BANKS = window.QUIZ_BANKS || {};
window.QUIZ_BANKS["web"] = {
  "id": "web",
  "title": "Web 前端",
  "short": "Web前端题库",
  "source": "Web题库.md",
  "chapters": [
    {
      "id": "web-1",
      "title": "一、HTML基础",
      "questions": [
        {
          "id": "web-1-1",
          "type": "single",
          "text": "下面选项中，用于为页面添加视频的标签是（）。",
          "options": [
            {
              "k": "A",
              "t": "audio"
            },
            {
              "k": "B",
              "t": "video"
            },
            {
              "k": "C",
              "t": "text"
            },
            {
              "k": "D",
              "t": "image"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "在 HTML5 中，`<video>` 标签用于在页面中嵌入视频内容，而 `<audio>` 用于音频。"
        },
        {
          "id": "web-1-2",
          "type": "single",
          "text": "下列选项中，用来设置一行内容的垂直对齐方式的是（）。",
          "options": [
            {
              "k": "A",
              "t": "height"
            },
            {
              "k": "B",
              "t": "align"
            },
            {
              "k": "C",
              "t": "valign"
            },
            {
              "k": "D",
              "t": "background"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "在HTML中，valign属性用于设置表格单元格中内容的垂直对齐方式，可选值有top、middle、bottom等。height设置高度，align设置水平对齐，background设置背景，因此正确答案是C。"
        },
        {
          "id": "web-1-3",
          "type": "single",
          "text": "Web标准的制定者是?()",
          "options": [
            {
              "k": "A",
              "t": "以上都不是"
            },
            {
              "k": "B",
              "t": "微软(Microsoft)"
            },
            {
              "k": "C",
              "t": "网景公司(Netscape)"
            },
            {
              "k": "D",
              "t": "万维网联盟(W3C)"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "Web标准由万维网联盟（W3C）制定，W3C致力于开发Web技术规范。微软和网景公司是浏览器厂商，曾主导浏览器市场，但并非标准制定者。因此正确答案是D。"
        },
        {
          "id": "web-1-4",
          "type": "single",
          "text": "下面选项中，有哪些浏览器是基于Trident内核的()。",
          "options": [
            {
              "k": "A",
              "t": "谷歌浏览器"
            },
            {
              "k": "B",
              "t": "火狐浏览器"
            },
            {
              "k": "C",
              "t": "欧朋浏览器"
            },
            {
              "k": "D",
              "t": "IE浏览器"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "Trident内核由微软开发，主要用于IE浏览器。谷歌浏览器使用Blink内核，火狐浏览器使用Gecko内核，欧朋浏览器早期使用Presto内核，现也使用Blink内核。因此只有IE浏览器基于Trident内核。"
        },
        {
          "id": "web-1-5",
          "type": "single",
          "text": "在下列的HTML中，哪个可以产生超链接?()",
          "options": [
            {
              "k": "A",
              "t": "`<a url=\"http://www.w3school.com.cn\">W3School.com.cn</a>`"
            },
            {
              "k": "B",
              "t": "`<a href=\"http://www.w3school.com.cn\">W3School</a>`"
            },
            {
              "k": "C",
              "t": "`<a>http://www.w3school.com.cn</a>`"
            },
            {
              "k": "D",
              "t": "`<a name=\"http://www.w3school.com.cn\">W3School.com.cn</a>`"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "超链接使用`<a>`标签的href属性指定链接目标。选项B正确使用了href属性。选项A使用了错误的url属性；选项C缺少href属性；选项D的name属性用于定义锚点，不产生超链接。"
        },
        {
          "id": "web-1-6",
          "type": "single",
          "text": "以下哪个是HTML中的内联(行内)元素？",
          "options": [
            {
              "k": "A",
              "t": "`<span>`"
            },
            {
              "k": "B",
              "t": "`<div>`"
            },
            {
              "k": "C",
              "t": "`<p>`"
            },
            {
              "k": "D",
              "t": "`<h1>`"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "内联元素不会独占一行，常见的有 `<span>`、`<a>`、`<img>` 等；`<div>`、`<p>`、`<h1>` 是块级元素。"
        },
        {
          "id": "web-1-7",
          "type": "single",
          "text": "在下列的HTML中，哪个可以插入换行?()",
          "options": [
            {
              "k": "A",
              "t": "`<br/>`"
            },
            {
              "k": "B",
              "t": "`<break>`"
            },
            {
              "k": "C",
              "t": "`<lb/>`"
            },
            {
              "k": "D",
              "t": "以上都不是"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML中，`<br>`或`<br/>`用于插入换行，是标准标签。`<break>`和`<lb/>`不是有效HTML标签，因此正确答案是A。"
        },
        {
          "id": "web-1-8",
          "type": "single",
          "text": "在下列的HTML中，哪个是字号最大的标题?()",
          "options": [
            {
              "k": "A",
              "t": "`<heading>`"
            },
            {
              "k": "B",
              "t": "`<head>`"
            },
            {
              "k": "C",
              "t": "`<h1>`"
            },
            {
              "k": "D",
              "t": "`<h6>`"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "在HTML中，标题标签从`<h1>`到`<h6>`，字号依次减小，`<h1>`是最大的标题。`<heading>`和`<head>`不是标题标签，`<head>`用于定义文档头部信息。"
        },
        {
          "id": "web-1-9",
          "type": "single",
          "text": "下列标签中，用于定义HTML5文档所要显示内容的是()。",
          "options": [
            {
              "k": "A",
              "t": "`<body></body>`"
            },
            {
              "k": "B",
              "t": "`<html></html>`"
            },
            {
              "k": "C",
              "t": "`<head></head>`"
            },
            {
              "k": "D",
              "t": "`<title></title>`"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML5文档中，`<body>`标签用于定义文档的主体内容，即浏览器中显示的所有可见内容。`<html>`是根标签，`<head>`包含元数据，`<title>`定义标题，均不直接显示内容。因此正确答案是A。"
        },
        {
          "id": "web-1-10",
          "type": "single",
          "text": "下列选项中属于单标签语法格式的是()。",
          "options": [
            {
              "k": "A",
              "t": "`<标签名>内容`"
            },
            {
              "k": "B",
              "t": "`<标签名/>`"
            },
            {
              "k": "C",
              "t": "`</标签名>`"
            },
            {
              "k": "D",
              "t": "`<标签名>`"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "单标签（自闭合标签）语法格式为`<标签名/>`，如`<br/>`。选项A是双标签的起始标签，选项C是结束标签，选项D缺少闭合斜杠，不符合XHTML规范。"
        },
        {
          "id": "web-1-11",
          "type": "single",
          "text": "下列属性中，用来设置单元格跨行合并的是（）。",
          "options": [
            {
              "k": "A",
              "t": "colspan"
            },
            {
              "k": "B",
              "t": "width"
            },
            {
              "k": "C",
              "t": "rowspan"
            },
            {
              "k": "D",
              "t": "bgcolor"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "colspan用于跨列合并，rowspan用于跨行合并。width设置宽度，bgcolor设置背景色。因此正确答案是C。"
        },
        {
          "id": "web-1-12",
          "type": "multi",
          "text": "下列选项中的术语名词，属于网页术语的是( )",
          "options": [
            {
              "k": "A",
              "t": "WEB"
            },
            {
              "k": "B",
              "t": "IOS"
            },
            {
              "k": "C",
              "t": "HTTP"
            },
            {
              "k": "D",
              "t": "DNS"
            }
          ],
          "answer": [
            "A",
            "C",
            "D"
          ],
          "analysis": "WEB、HTTP、DNS都是与网页相关的术语。WEB指万维网，HTTP是超文本传输协议，DNS是域名系统，用于解析域名。IOS是苹果移动操作系统，与网页无关。"
        },
        {
          "id": "web-1-13",
          "type": "multi",
          "text": "下列选项中，属于`<tr>`标签相关属性的是( )。",
          "options": [
            {
              "k": "A",
              "t": "background"
            },
            {
              "k": "B",
              "t": "right"
            },
            {
              "k": "C",
              "t": "align"
            },
            {
              "k": "D",
              "t": "height"
            }
          ],
          "answer": [
            "A",
            "C",
            "D"
          ],
          "analysis": "`<tr>`标签的HTML属性包括align（水平对齐）、background（背景图像）、height（高度）等，而right不是标准属性。因此A、C、D正确。"
        },
        {
          "id": "web-1-14",
          "type": "multi",
          "text": "关于`<title>`标签的相关描述，下列说法正确的是( )。",
          "options": [
            {
              "k": "A",
              "t": "一个HTML文档只能包含一对`<title>`标签"
            },
            {
              "k": "B",
              "t": "`<title>`标签必须包含在`<head>`之内"
            },
            {
              "k": "C",
              "t": "`<title></title>`之间的内容将显示在浏览器窗口的标题栏中"
            },
            {
              "k": "D",
              "t": "`<title>`标签和`<head>`标签是并列关系"
            }
          ],
          "answer": [
            "A",
            "B",
            "C"
          ],
          "analysis": "一个HTML文档只能有一对`<title>`标签，且必须位于`<head>`标签内，其内容显示在浏览器标题栏。选项D错误，因为`<title>`是`<head>`的子元素，不是并列关系。"
        },
        {
          "id": "web-1-15",
          "type": "judge",
          "text": "在HTML中，form标签可以实现用户信息的收集和传递。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "form标签用于创建表单，包含输入控件，用户填写后通过提交按钮将数据发送到服务器，实现信息收集和传递。这是HTML表单的基本功能，表述正确。"
        },
        {
          "id": "web-1-16",
          "type": "judge",
          "text": "在表格中，有几对`<tr></tr>`，就表示该表格有几行。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML表格中，`<tr>`标签用于定义表格的行，每对`<tr></tr>`代表一行。因此，有几对`<tr></tr>`就表示表格有几行。这是表格结构的基本规则，没有歧义。"
        },
        {
          "id": "web-1-17",
          "type": "judge",
          "text": "在网页制作中，图片只能用GIF格式。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "网页制作中常用的图片格式包括GIF、JPEG、PNG、WebP等，GIF仅支持256色且不支持半透明，适用于简单动画或图标，但并非唯一格式。因此该说法错误。"
        },
        {
          "id": "web-1-18",
          "type": "judge",
          "text": "在超链接中，如果暂时没有确定链接目标，通常将`<a>`标签的href属性值定义为\"#\"。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML中，当超链接的href属性设置为\"#\"时，表示链接到当前页面的顶部，常用于占位符。这是一种常见做法，表示链接目标尚未确定，避免页面刷新或跳转。"
        },
        {
          "id": "web-1-19",
          "type": "judge",
          "text": "设置标签属性时，标签名与属性、属性与属性之间均以逗号分开。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "在HTML中，设置标签属性时，标签名与属性、属性与属性之间应以空格分隔，而非逗号。例如：`<img src=\"a.jpg\" alt=\"b\">`。使用逗号是错误的写法，这是初学者容易混淆的地方。"
        },
        {
          "id": "web-1-20",
          "type": "judge",
          "text": "创建锚点链接包括创建链接文本和设置跳转目标位置两个步骤。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "创建锚点链接确实需要两个步骤：首先在目标位置设置锚点（如使用id属性），然后创建链接文本指向该锚点（如使用href=\"#id\"）。这是HTML中实现页面内跳转的标准方法。"
        },
        {
          "id": "web-1-21",
          "type": "judge",
          "text": "在标签嵌套结构中，双标签可以作为父级标签。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "双标签如`<div>`、`<p>`等可以包含其他标签，作为父级标签是HTML嵌套结构的基础。例如`<div><p>`文本`</p></div>`中`<div>`是父级。注意单标签如`<br>`不能作为父级。"
        },
        {
          "id": "web-1-22",
          "type": "judge",
          "text": "标签就是放在\"< >\"标签符中表示某个功能的编码命令。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML中，标签通常由尖括号包围，如`<div>`，用于定义网页元素的功能或结构。题干描述符合标签的基本定义，因此正确。注意标签通常成对出现，但自闭合标签如`<br>`也符合此描述。"
        },
        {
          "id": "web-1-23",
          "type": "judge",
          "text": "在不同的浏览器中调用video标签时，视频的显示效果完全相同。（ ）",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "不同浏览器对视频格式的支持不同，且默认样式和控件可能有所差异，因此显示效果不一定相同。易错点：误以为所有浏览器统一标准。"
        },
        {
          "id": "web-1-24",
          "type": "judge",
          "text": "在表格中，cellpadding属性用于设置单元格内容与单元格边框之间的空白间距。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "cellpadding属性确实用于设置单元格内容与单元格边框之间的空白间距，这是HTML表格的基本属性。易错点：注意区分cellpadding（内边距）和cellspacing（单元格间距）。"
        },
        {
          "id": "web-1-25",
          "type": "judge",
          "text": "在`<audio>`和`</audio>`之间不能插入文字。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "在`<audio>`和`</audio>`之间可以插入文字，这些文字会在浏览器不支持audio元素时显示，作为后备内容。因此，题干说法错误。"
        }
      ]
    },
    {
      "id": "web-2",
      "title": "二、HTML进阶",
      "questions": [
        {
          "id": "web-2-1",
          "type": "single",
          "text": "当图像不能显示时，可以用下列哪个属性设置其替换文本()。",
          "options": [
            {
              "k": "A",
              "t": "font"
            },
            {
              "k": "B",
              "t": "head"
            },
            {
              "k": "C",
              "t": "face"
            },
            {
              "k": "D",
              "t": "alt"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "在HTML中，`<img>`标签的alt属性用于指定图像的替换文本，当图像无法显示时，浏览器会显示该文本。其他选项如font、head、face均不是用于此目的。"
        },
        {
          "id": "web-2-2",
          "type": "single",
          "text": "关于定义有序列表的基本语法格式，下列书写正确的是()。",
          "options": [
            {
              "k": "A",
              "t": "`<ul> 列表项1 列表项2</ul>`"
            },
            {
              "k": "B",
              "t": "`<ul> <li>列表项1</li> <li>列表项2</li>……</ul>`"
            },
            {
              "k": "C",
              "t": "`<ol> <li>列表项1</li> <li>列表项2</li>……</ol>`"
            },
            {
              "k": "D",
              "t": "`<ol>列表项1</ol><ol>列表项2</ol>`"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "有序列表使用`<ol>`标签，列表项使用`<li>`标签。选项C正确。A和B使用`<ul>`是无序列表，D中每个列表项单独用`<ol>`错误。"
        },
        {
          "id": "web-2-3",
          "type": "single",
          "text": "在下列的HTML中，哪个可以插入图像?()",
          "options": [
            {
              "k": "A",
              "t": "`<img src=\"image.gif\"/>`"
            },
            {
              "k": "B",
              "t": "image.gif"
            },
            {
              "k": "C",
              "t": "`<img href=\"image.gif\"/>`"
            },
            {
              "k": "D",
              "t": "`<img>image.gif</img>`"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML中，插入图像使用`<img>`标签，其src属性指定图像文件的路径。选项A正确使用了src属性。选项B不是HTML标签。选项C错误使用了href属性（用于链接）。选项D的写法不符合`<img>`标签的语法，`<img>`是自闭合标签，不应包含内容。"
        },
        {
          "id": "web-2-4",
          "type": "single",
          "text": "下列属性中，用来设置单元格横跨列数的是()。",
          "options": [
            {
              "k": "A",
              "t": "colspan"
            },
            {
              "k": "B",
              "t": "bgcolor"
            },
            {
              "k": "C",
              "t": "width"
            },
            {
              "k": "D",
              "t": "rowspan"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "colspan属性用于设置单元格横跨的列数，即合并多列。rowspan用于合并行，bgcolor设置背景色，width设置宽度。因此正确答案是A。"
        },
        {
          "id": "web-2-5",
          "type": "single",
          "text": "要在HTML页面中直接引入外部CSS样式表，应使用的标签是（）",
          "options": [
            {
              "k": "A",
              "t": "`<script>`"
            },
            {
              "k": "B",
              "t": "`<link>`"
            },
            {
              "k": "C",
              "t": "`<style>`"
            },
            {
              "k": "D",
              "t": "`<import>`"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "在HTML中，引入外部CSS样式表应使用`<link>`标签，通过href属性指定CSS文件路径。选项A的`<script>`用于引入JavaScript，选项C的`<style>`用于定义内部样式，选项D的`<import>`不是标准HTML标签。"
        },
        {
          "id": "web-2-6",
          "type": "single",
          "text": "在 CSS 中，用于设置元素**外边距**的属性是（　）",
          "options": [],
          "answer": [
            "A"
          ],
          "analysis": "CSS 中用 margin 设置外边距，padding 设置内边距，border 设置边框，outline 是轮廓线。"
        },
        {
          "id": "web-2-7",
          "type": "single",
          "text": "在定义列表中，用于对名词进行解释和描述的标签是 ()。",
          "options": [
            {
              "k": "A",
              "t": "`<dd></dd>`"
            },
            {
              "k": "B",
              "t": "`<li></li>`"
            },
            {
              "k": "C",
              "t": "`<dt></dt>`"
            },
            {
              "k": "D",
              "t": "`<dl></dl>`"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML定义列表（`<dl>`）中，`<dt>`用于定义术语/名词，`<dd>`用于描述/解释该术语。题目问的是“对名词进行解释和描述的标签”，因此正确答案是`<dd>`，对应选项A。易错点：混淆`<dt>`（名词）和`<dd>`（描述）。"
        },
        {
          "id": "web-2-8",
          "type": "single",
          "text": "下列选项中，可以设置文字字体的属性是()。",
          "options": [
            {
              "k": "A",
              "t": "color"
            },
            {
              "k": "B",
              "t": "font"
            },
            {
              "k": "C",
              "t": "size"
            },
            {
              "k": "D",
              "t": "face"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "在CSS中，设置文字字体的属性是font-family，而font是复合属性，可以同时设置字体、大小、粗细等。color设置颜色，size不是CSS属性，face是HTML的font标签属性，已废弃。因此正确选项是B。"
        },
        {
          "id": "web-2-9",
          "type": "single",
          "text": "下面选项中，用于为页面添加音频的标签是()。",
          "options": [
            {
              "k": "A",
              "t": "image"
            },
            {
              "k": "B",
              "t": "video"
            },
            {
              "k": "C",
              "t": "audio"
            },
            {
              "k": "D",
              "t": "以上都不是"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "HTML5中，`<audio>`标签专门用于在页面中嵌入音频内容，支持MP3、WAV等格式。选项A的`<image>`是图片标签，选项B的`<video>`用于视频，因此正确答案是C。"
        },
        {
          "id": "web-2-10",
          "type": "multi",
          "text": "下列选项中，属于表单标签`<form>`的属性是()。",
          "options": [
            {
              "k": "A",
              "t": "name"
            },
            {
              "k": "B",
              "t": "action"
            },
            {
              "k": "C",
              "t": "method"
            },
            {
              "k": "D",
              "t": "size"
            }
          ],
          "answer": [
            "A",
            "B",
            "C"
          ],
          "analysis": "表单标签`<form>`的常用属性包括name（表单名称）、action（提交地址）和method（提交方式，如get/post）。size属性通常用于`<input>`或`<select>`等元素，不属于`<form>`的属性。因此正确答案为A、B、C。"
        },
        {
          "id": "web-2-11",
          "type": "judge",
          "text": "一个HTML5文档可以包含多对`<head>`标签。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "一个HTML5文档只能包含一对`<head>`标签，用于定义文档的头部信息，如标题、样式、脚本等。包含多对`<head>`标签会导致文档结构错误，不符合HTML规范。"
        },
        {
          "id": "web-2-12",
          "type": "judge",
          "text": "有序列表是指有排列顺序的列表，其各个列表项按照一定的顺序排列。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "有序列表（`<ol>`）中的列表项（`<li>`）默认按数字顺序排列，且可通过type属性改变编号类型，因此题干描述正确。"
        },
        {
          "id": "web-2-13",
          "type": "judge",
          "text": "无序列表的各个列表项之间，虽然没有顺序级别，但是存在主次关系。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "无序列表（`<ul>`）中的列表项（`<li>`）之间没有顺序级别，也不存在主次关系，它们处于并列的层级。题目中“存在主次关系”的说法错误，易混淆于有序列表或嵌套列表。"
        },
        {
          "id": "web-2-14",
          "type": "judge",
          "text": "在定义单选按钮时，必须为同一组中的选项指定相同的name值，这样\"单选\"才会生效。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML中，单选按钮通过相同的name属性值来分组，同一组中只能选择一个选项。如果name值不同，则每个按钮独立，无法实现单选效果。这是HTML表单的基本规则。"
        },
        {
          "id": "web-2-15",
          "type": "judge",
          "text": "src属性可以让音频具有循环播放功能。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "src属性用于指定音频文件的URL，而循环播放功能由loop属性控制。因此，仅设置src属性无法实现循环播放，需添加loop属性。"
        }
      ]
    },
    {
      "id": "web-3",
      "title": "三、HTML表单与表格",
      "questions": [
        {
          "id": "web-3-1",
          "type": "single",
          "text": "关于创建锚点链接的代码,下列书写正确的是()。",
          "options": [
            {
              "k": "A",
              "t": "`<a href=\"#\">链接文本</a>……<h3 id=\"one\">锚点链接 </h3>`"
            },
            {
              "k": "B",
              "t": "`<a href=\"#one\">链接文本</a>……<h3 id=\"#one\">锚点链接 </h3>`"
            },
            {
              "k": "C",
              "t": "`<a href=\"#one\">链接文本</a>……<h3 id=\"one\">锚点链接 </h3>`"
            },
            {
              "k": "D",
              "t": "`<a href=\"#id\">链接文本</a>……<h3 id=\"one\">锚点链接 </h3>`"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "锚点链接的正确写法是：链接的href属性值为#加上目标元素的id值，目标元素的id值不加#。选项C符合规范。选项A的href=\"#\"表示空链接，不是锚点；选项B的目标id错误地加了#；选项D的href=\"#id\"与目标id不匹配。"
        },
        {
          "id": "web-3-2",
          "type": "single",
          "text": "下面的代码中,可以设置单元格宽度的是()。",
          "options": [
            {
              "k": "A",
              "t": "td{line-height:50px;}"
            },
            {
              "k": "B",
              "t": "td{font-size:50px;}"
            },
            {
              "k": "C",
              "t": "td{height:50px;}"
            },
            {
              "k": "D",
              "t": "td{width:50px;}"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "单元格宽度通过CSS的width属性设置。选项D正确，因为width直接控制单元格宽度。其他选项：A设置行高，B设置字体大小，C设置高度，均不影响宽度。易错点：混淆height和width。"
        },
        {
          "id": "web-3-3",
          "type": "single",
          "text": "关于HTML标签设置属性的基本语法格式，下列选项正确的是()。",
          "options": [
            {
              "k": "A",
              "t": "`<标签名 属性1=\"属性值1\"属性2=\"属性值2\"…>内容 </标签名>;`"
            },
            {
              "k": "B",
              "t": "`<标签名 属性1=\";属性值1\" 属性2=\";属性值2\"…> 内容 </标签名>;`"
            },
            {
              "k": "C",
              "t": "`<标签名 属性1=\"属性值1\" 属性2=\"属性值2\"…> 内容 </标签名>;`"
            },
            {
              "k": "D",
              "t": "`<title>属性</title>;`"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "HTML标签属性语法要求属性名和属性值之间用等号连接，属性值用双引号括起来，多个属性之间用空格分隔。选项C符合规范。选项A缺少属性间空格，选项B属性值前有多余分号，选项D是标签内容而非属性设置。"
        },
        {
          "id": "web-3-4",
          "type": "single",
          "text": "下列选项中，用来定义多行文本输入框的是 ()。",
          "options": [
            {
              "k": "A",
              "t": "`<input/>`"
            },
            {
              "k": "B",
              "t": "`<form>`"
            },
            {
              "k": "C",
              "t": "`<select></select>`"
            },
            {
              "k": "D",
              "t": "`<textarea></textarea>`"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "多行文本输入框使用`<textarea>`标签，其可以输入多行文本。而`<input>`通常用于单行输入，`<form>`用于表单容器，`<select>`用于下拉列表。因此正确答案是D。"
        },
        {
          "id": "web-3-5",
          "type": "single",
          "text": "以下选项中,哪个全部都是表格标签?()",
          "options": [
            {
              "k": "A",
              "t": "`<thead><body><tr>`"
            },
            {
              "k": "B",
              "t": "`<table><tr><tl>`"
            },
            {
              "k": "C",
              "t": "`<table><tr><td>`"
            },
            {
              "k": "D",
              "t": "`<table><head><tfoot>`"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "表格标签包括`<table>`、`<tr>`（行）、`<td>`（单元格）等。选项C全部是表格标签。A中`<body>`不是表格标签；B中`<tl>`不存在；D中`<head>`不是表格标签。"
        },
        {
          "id": "web-3-6",
          "type": "multi",
          "text": "下列选项中，属于表单控件的是 ()。",
          "options": [
            {
              "k": "A",
              "t": "密码输入框"
            },
            {
              "k": "B",
              "t": "单行文本输入框"
            },
            {
              "k": "C",
              "t": "提交按钮"
            },
            {
              "k": "D",
              "t": "复选框"
            }
          ],
          "answer": [
            "A",
            "B",
            "C",
            "D"
          ],
          "analysis": "表单控件包括输入框、按钮、复选框等，用于用户交互和数据提交。密码输入框、单行文本输入框、提交按钮和复选框都是常见的表单控件，因此全部正确。"
        },
        {
          "id": "web-3-7",
          "type": "multi",
          "text": "下列选项中，属于`<textarea>`标签的必须属性的是 ()",
          "options": [
            {
              "k": "A",
              "t": "value"
            },
            {
              "k": "B",
              "t": "rows"
            },
            {
              "k": "C",
              "t": "size"
            },
            {
              "k": "D",
              "t": "cols"
            }
          ],
          "answer": [
            "B",
            "D"
          ],
          "analysis": "`<textarea>`标签的必须属性是rows和cols，它们定义了文本区域的可见行数和列数。value不是属性，而是标签内容；size不是textarea的属性。易错点：混淆input和textarea的属性。"
        },
        {
          "id": "web-3-8",
          "type": "judge",
          "text": "在定义下拉列表时，`<optgroup>`标签有一个必需属性label，用于定义具体的组名。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML中，`<optgroup>`标签用于对`<select>`下拉列表中的选项进行分组，其label属性是必需的，用于定义组名，以便用户识别。如果没有label属性，分组将无意义。因此，该说法正确。"
        },
        {
          "id": "web-3-9",
          "type": "judge",
          "text": "HTML5中的form属性，可以把表单内的子元素写在页面中的任一位置。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "HTML5的form属性允许表单控件通过指定form属性值关联到页面中任意位置的表单，无需将控件放在form元素内部。这提高了布局灵活性，但需注意form属性值必须与对应表单的id匹配。"
        },
        {
          "id": "web-3-10",
          "type": "judge",
          "text": "method属性用于设置表单数据的提交方式。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "method属性是HTML表单元素的重要属性，用于指定表单数据提交的HTTP方法，常见取值为GET或POST。题干表述正确，符合HTML规范。"
        },
        {
          "id": "web-3-11",
          "type": "judge",
          "text": "一个标签只能设置一个属性。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "HTML标签可以设置多个属性，例如`<a href=\"...\" target=\"_blank\">`同时设置了href和target属性。题目说法错误，易混淆为某些属性只能出现一次。"
        }
      ]
    },
    {
      "id": "web-4",
      "title": "四、CSS",
      "questions": [
        {
          "id": "web-4-1",
          "type": "single",
          "text": "CSS3中，()选择器用于为父元素中的第一个子元素设置样式。",
          "options": [
            {
              "k": "A",
              "t": "first-child"
            },
            {
              "k": "B",
              "t": "nth-child"
            },
            {
              "k": "C",
              "t": "only-child"
            },
            {
              "k": "D",
              "t": "last-child"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "first-child选择器用于匹配父元素中的第一个子元素，并为其设置样式。选项A正确。nth-child(n)选择第n个子元素，only-child选择唯一的子元素，last-child选择最后一个子元素，均不符合题意。"
        },
        {
          "id": "web-4-2",
          "type": "single",
          "text": "()属性用于调整重叠定位元素的堆叠顺序。",
          "options": [
            {
              "k": "A",
              "t": "order"
            },
            {
              "k": "B",
              "t": "z-index"
            },
            {
              "k": "C",
              "t": "index"
            },
            {
              "k": "D",
              "t": "list"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "z-index属性用于控制定位元素（如position: relative/absolute/fixed/sticky）的堆叠顺序，值越大越靠上。order用于flex布局，index和list无此功能。"
        },
        {
          "id": "web-4-3",
          "type": "single",
          "text": "()属性是CSS3的新增属性，用于定义服务器字体。通过此属性，开发者可以在用户计算机未安装字体时，使用任何喜欢的字体。",
          "options": [
            {
              "k": "A",
              "t": "@font-face"
            },
            {
              "k": "B",
              "t": "@font"
            },
            {
              "k": "C",
              "t": "face"
            },
            {
              "k": "D",
              "t": "font-family"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "@font-face 是 CSS3 新增的规则，允许开发者定义服务器字体，当用户计算机未安装该字体时，浏览器会从服务器下载并使用。选项 A 正确。@font 和 face 不是有效 CSS 属性，font-family 用于指定字体族名称，但不能定义服务器字体。"
        },
        {
          "id": "web-4-4",
          "type": "multi",
          "text": "下列选项中，用于更改元素内边距的是（ ）。",
          "options": [
            {
              "k": "A",
              "t": "padding-left"
            },
            {
              "k": "B",
              "t": "padding-right"
            },
            {
              "k": "C",
              "t": "text-indent"
            },
            {
              "k": "D",
              "t": "margin-left"
            }
          ],
          "answer": [
            "A",
            "B"
          ],
          "analysis": "padding-left 用于设置元素左内边距，padding-right 用于设置元素右内边距，二者都属于 padding 内边距属性。text-indent 是文本缩进，margin-left 是外边距。因此本题应为多选题，答案为 A、B。"
        },
        {
          "id": "web-4-5",
          "type": "single",
          "text": "()属性用于设置文本的下划线，上划线，删除线等装饰效果。",
          "options": [
            {
              "k": "A",
              "t": "text-transform"
            },
            {
              "k": "B",
              "t": "text-indent"
            },
            {
              "k": "C",
              "t": "text-decoration"
            },
            {
              "k": "D",
              "t": "text-align"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "text-decoration属性用于设置文本的装饰效果，如下划线、上划线、删除线等。text-transform控制大小写，text-indent控制缩进，text-align控制对齐，均不符合题意。"
        },
        {
          "id": "web-4-6",
          "type": "single",
          "text": "层次选择器中表示相邻兄弟选择器的是 ()。",
          "options": [
            {
              "k": "A",
              "t": "E ~ F"
            },
            {
              "k": "B",
              "t": "E + F"
            },
            {
              "k": "C",
              "t": "E > F"
            },
            {
              "k": "D",
              "t": "E F"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "相邻兄弟选择器使用加号（+）连接两个元素，表示选择紧接在E元素后的第一个F元素。选项A是通用兄弟选择器，C是子选择器，D是后代选择器。"
        },
        {
          "id": "web-4-7",
          "type": "single",
          "text": "下列属性中不属于float的属性为 ()。",
          "options": [
            {
              "k": "A",
              "t": "none"
            },
            {
              "k": "B",
              "t": "both"
            },
            {
              "k": "C",
              "t": "right"
            },
            {
              "k": "D",
              "t": "left"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "float属性在CSS中用于设置元素的浮动方向，其可选值包括none（不浮动）、left（左浮动）、right（右浮动）和inherit（继承父元素）。选项B的both不是float的有效值，它是clear属性的值，用于清除浮动。因此，不属于float属性的选项是B。"
        },
        {
          "id": "web-4-8",
          "type": "single",
          "text": "下列选项中，用于设置首行文本缩进的属性是 ()。",
          "options": [
            {
              "k": "A",
              "t": "text-shadow"
            },
            {
              "k": "B",
              "t": "text-overflow"
            },
            {
              "k": "C",
              "t": "white-space"
            },
            {
              "k": "D",
              "t": "text-indent"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "text-indent属性用于设置文本块中首行文本的缩进，是CSS中专门控制首行缩进的属性。其他选项：text-shadow设置文本阴影，text-overflow处理文本溢出，white-space控制空白符处理，均与首行缩进无关。"
        },
        {
          "id": "web-4-9",
          "type": "single",
          "text": "下列选项中，用于设置边框样式的属性是 ()。",
          "options": [
            {
              "k": "A",
              "t": "border-height"
            },
            {
              "k": "B",
              "t": "border-color"
            },
            {
              "k": "C",
              "t": "border-style"
            },
            {
              "k": "D",
              "t": "border-width"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "border-style属性用于设置边框的样式，如solid、dashed等。border-color设置颜色，border-width设置宽度，没有border-height属性。"
        },
        {
          "id": "web-4-10",
          "type": "single",
          "text": "下列选项中，用来表示通配符选择器的符号是 ()。",
          "options": [
            {
              "k": "A",
              "t": "*"
            },
            {
              "k": "B",
              "t": "."
            },
            {
              "k": "C",
              "t": "?"
            },
            {
              "k": "D",
              "t": "#"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "通配符选择器用星号（*）表示，可以匹配页面中的所有元素。选项B是类选择器，选项D是ID选择器，选项C不是有效的CSS选择器符号。"
        },
        {
          "id": "web-4-11",
          "type": "single",
          "text": "()是将所有的样式放在一个或多个以.css为扩展名的外部样式表文件中，实现了结构和样式完全分离。",
          "options": [
            {
              "k": "A",
              "t": "!important"
            },
            {
              "k": "B",
              "t": "内嵌式"
            },
            {
              "k": "C",
              "t": "外链式"
            },
            {
              "k": "D",
              "t": "行内式"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "外链式（外部样式表）将CSS代码单独存放在.css文件中，通过`<link>`标签引入HTML文档，实现了结构与样式的完全分离。内嵌式和行内式则未完全分离，!important是CSS优先级规则。"
        },
        {
          "id": "web-4-12",
          "type": "single",
          "text": "下列选项中，关于选择器权重的优先级的说法正确的是 ()。",
          "options": [
            {
              "k": "A",
              "t": "ID选择器 > 类选择器 > 标签选择器"
            },
            {
              "k": "B",
              "t": "标签选择器 > 类选择器 > ID选择器"
            },
            {
              "k": "C",
              "t": "类选择器 < ID选择器 < 标签选择器"
            },
            {
              "k": "D",
              "t": "标签选择器 > ID选择器 > 类选择器"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "CSS选择器优先级中，ID选择器权重最高（0,1,0,0），类选择器次之（0,0,1,0），标签选择器最低（0,0,0,1）。因此正确顺序为ID选择器 > 类选择器 > 标签选择器，对应选项A。"
        },
        {
          "id": "web-4-13",
          "type": "single",
          "text": "id选择器使用 () 进行标识，后面紧跟id名。",
          "options": [
            {
              "k": "A",
              "t": "#"
            },
            {
              "k": "B",
              "t": "^"
            },
            {
              "k": "C",
              "t": "$"
            },
            {
              "k": "D",
              "t": "."
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在CSS中，id选择器使用井号（#）进行标识，后面紧跟id名。例如，#myId表示选择id为myId的元素。其他选项中，^和$是正则表达式中的符号，.是类选择器的标识符。因此正确答案是A。"
        },
        {
          "id": "web-4-14",
          "type": "single",
          "text": "CSS样式规则由选择器和声明构成。写法正确的是（ ）。",
          "options": [
            {
              "k": "A",
              "t": "选择器{属性1:属性值1; 属性2:属性值2; 属性3:属性值3;}"
            },
            {
              "k": "B",
              "t": "选择器(属性1:属性值1; 属性2:属性值2; 属性3:属性值3;)"
            },
            {
              "k": "C",
              "t": "选择器{属性1=属性值1; 属性2=属性值2; 属性3=属性值3;}"
            },
            {
              "k": "D",
              "t": "{选择器:属性1:属性值1; 属性2:属性值2; 属性3:属性值3;}"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "CSS 规则由选择器和声明块组成，声明块写在花括号中；每条声明由“属性: 属性值”构成，多条声明之间用分号分隔。A 符合语法；B 使用圆括号，C 使用等号，D 把选择器写进声明块，均不正确。"
        },
        {
          "id": "web-4-15",
          "type": "single",
          "text": "在设置页面布局时，可以使用 () 的布局方法。",
          "options": [
            {
              "k": "A",
              "t": "绝对定位法"
            },
            {
              "k": "B",
              "t": "相对定位法"
            },
            {
              "k": "C",
              "t": "浮动法"
            },
            {
              "k": "D",
              "t": "以上方法均可以"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "在设置页面布局时，绝对定位、相对定位和浮动都是常用的CSS布局方法。绝对定位使元素脱离文档流，相对定位保留原位置，浮动用于实现文字环绕或横向排列。三种方法均可用于页面布局，因此D选项正确。"
        },
        {
          "id": "web-4-16",
          "type": "single",
          "text": "下列样式代码中，可以实现相对定位的是 ()。",
          "options": [
            {
              "k": "A",
              "t": "position: fixed;"
            },
            {
              "k": "B",
              "t": "position: absolute;"
            },
            {
              "k": "C",
              "t": "position: static;"
            },
            {
              "k": "D",
              "t": "position: relative;"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "相对定位使用position: relative;，元素相对于其正常位置进行偏移，同时保留原占位空间。选项A是固定定位，B是绝对定位，C是静态定位（默认），均不符合相对定位的定义。"
        },
        {
          "id": "web-4-17",
          "type": "judge",
          "text": "在驼峰式命名中，所有单词都要大写。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "驼峰式命名分为小驼峰和大驼峰。小驼峰首单词小写，后续单词首字母大写，如'firstName'；大驼峰所有单词首字母大写，如'FirstName'。题干说所有单词都要大写，这是错误的，因为小驼峰首单词小写。"
        },
        {
          "id": "web-4-18",
          "type": "judge",
          "text": "CSS3中，nth-last-of-type(n)选择器属于结构化伪类选择器。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "nth-last-of-type(n)是CSS3中新增的结构化伪类选择器，它根据元素在其父元素中同类型子元素的位置（从后往前计数）进行选择，属于结构化伪类。"
        },
        {
          "id": "web-4-19",
          "type": "judge",
          "text": "当对元素应用overflow:hidden;样式时，元素的溢出内容会被修剪。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "overflow:hidden; 会隐藏超出元素内容区域的溢出部分，因此正确。注意：该属性不会触发滚动条，溢出内容完全不可见。"
        },
        {
          "id": "web-4-20",
          "type": "judge",
          "text": "当表格的border-collapse属性设置为collapse时，HTML中设置的cellspacing属性无效。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "当border-collapse: collapse时，表格边框合并，单元格间距由CSS控制，HTML的cellspacing属性失效。"
        },
        {
          "id": "web-4-21",
          "type": "judge",
          "text": "设置了浮动属性值为left的元素不会脱离标准文档流的控制。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "设置了浮动属性值为left的元素会脱离标准文档流，不再占据原位置，后续元素会填补其空间。这是CSS浮动的基本特性，易错点在于混淆浮动与定位的脱离文档流概念。"
        },
        {
          "id": "web-4-22",
          "type": "judge",
          "text": "在设置边框颜色时，无需同时设置边框样式就能显示边框。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "边框颜色必须与边框样式同时设置才能显示，因为默认边框样式为none，此时边框不可见。即使设置了颜色，若样式为none，边框仍不会显示。"
        },
        {
          "id": "web-4-23",
          "type": "judge",
          "text": "E[attr*=value]属性选择器中，E可以省略。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "E[attr*=value]选择器中，E表示元素类型，可以省略。省略时表示匹配所有包含该属性的元素，这是CSS属性选择器的通用规则。"
        },
        {
          "id": "web-4-24",
          "type": "judge",
          "text": "父子标签的外边距发生合并。若子元素是父元素的第一个子元素，且父标签没有上内边距及边框，则父标签的上外边距会与子标签的上外边距发生合并。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "这是CSS外边距合并的典型情况。当父元素没有上内边距或边框时，其第一个子元素的上外边距会与父元素的上外边距合并，取两者中的较大值。"
        },
        {
          "id": "web-4-25",
          "type": "judge",
          "text": "`<div>`默认是块元素。()",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在HTML中，`<div>`标签默认是块级元素，会独占一行，宽度默认填满父容器。这是CSS的基础知识，正确。"
        }
      ]
    },
    {
      "id": "web-5",
      "title": "五、JavaScript基础",
      "questions": [
        {
          "id": "web-5-1",
          "type": "single",
          "text": "如何求得2和4中最大的数( )。",
          "options": [
            {
              "k": "A",
              "t": "Math.max(2,4)"
            },
            {
              "k": "B",
              "t": "top(2,4)"
            },
            {
              "k": "C",
              "t": "Math.min(2,4)"
            },
            {
              "k": "D",
              "t": "Math.ceil(2,4)"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "Math.max(2,4)返回两个数中的最大值，结果为4。其他选项：top不是JavaScript函数；Math.min返回最小值；Math.ceil用于向上取整，不能比较大小。"
        },
        {
          "id": "web-5-2",
          "type": "single",
          "text": "下列选项中，可以实现警告框的是( )。",
          "options": [
            {
              "k": "A",
              "t": "console.log()"
            },
            {
              "k": "B",
              "t": "alert()"
            },
            {
              "k": "C",
              "t": "prompt()"
            },
            {
              "k": "D",
              "t": "document.write()"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "alert() 方法用于显示带有一条指定消息和一个确认按钮的警告框，符合题目要求。console.log() 在控制台输出信息，prompt() 显示可输入对话框，document.write() 向文档写入内容，均不产生警告框。"
        },
        {
          "id": "web-5-3",
          "type": "single",
          "text": "在JavaScript中可以使用Date对象的( )方法返回该对象的某一天具体的日期。",
          "options": [
            {
              "k": "A",
              "t": "getMonth()"
            },
            {
              "k": "B",
              "t": "getYear()"
            },
            {
              "k": "C",
              "t": "getDate()"
            },
            {
              "k": "D",
              "t": "getTime()"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "getDate()方法返回一个月中的某一天（1-31），符合题目要求。getMonth()返回月份（0-11），getYear()返回年份（通常为当前年份减1900），getTime()返回时间戳。易错点：getDate()与getDay()（返回星期几）易混淆。"
        },
        {
          "id": "web-5-4",
          "type": "single",
          "text": "在 JavaScript 中，用于向数组**开头**添加元素的正确方法是（　）",
          "options": [
            {
              "k": "A",
              "t": "push()"
            },
            {
              "k": "B",
              "t": "unshift()"
            },
            {
              "k": "C",
              "t": "pop()"
            },
            {
              "k": "D",
              "t": "shift()"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "unshift() 在数组开头添加元素，push() 在末尾添加，pop() 从末尾删除，shift() 从开头删除。"
        },
        {
          "id": "web-5-5",
          "type": "single",
          "text": "在使用构造函数创建对象时，构造函数内部的this表示( )。",
          "options": [
            {
              "k": "A",
              "t": "新创建的对象"
            },
            {
              "k": "B",
              "t": "window对象"
            },
            {
              "k": "C",
              "t": "构造函数本身"
            },
            {
              "k": "D",
              "t": "原型对象"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在JavaScript中，使用new关键字调用构造函数时，构造函数内部的this指向新创建的对象实例。这是构造函数的核心特性，用于初始化新对象的属性。易错点：若忘记使用new，则this指向全局对象（如window），但题目明确指定“使用构造函数创建对象”，故应选A。"
        },
        {
          "id": "web-5-6",
          "type": "single",
          "text": "下列关于Javascript特征说法错误的是( )。",
          "options": [
            {
              "k": "A",
              "t": "Javascript支持面向对象"
            },
            {
              "k": "B",
              "t": "Javascript是一种非脚本语言"
            },
            {
              "k": "C",
              "t": "Javascript是事件驱动的"
            },
            {
              "k": "D",
              "t": "Javascript是独立于平台的"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "JavaScript是一种脚本语言，而非非脚本语言，因此选项B说法错误。JavaScript支持面向对象编程、事件驱动，并且独立于平台运行，故A、C、D正确。"
        },
        {
          "id": "web-5-7",
          "type": "single",
          "text": "下列选项中，可以获取到父节点的是()。",
          "options": [
            {
              "k": "A",
              "t": "childrenNode"
            },
            {
              "k": "B",
              "t": "parent"
            },
            {
              "k": "C",
              "t": "parentNode"
            },
            {
              "k": "D",
              "t": "Node"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "在DOM中，parentNode属性用于获取当前节点的父节点，而parent不是标准属性，childrenNode和Node也不正确。因此正确答案是C。"
        },
        {
          "id": "web-5-8",
          "type": "single",
          "text": "下列选项中,( )可以修改指定元素的指定属性值。",
          "options": [
            {
              "k": "A",
              "t": "removeAttribute()"
            },
            {
              "k": "B",
              "t": "setAttribute()"
            },
            {
              "k": "C",
              "t": "attributes"
            },
            {
              "k": "D",
              "t": "getAttribute()"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "setAttribute()方法用于设置或修改指定元素的指定属性值。removeAttribute()用于删除属性，attributes是属性集合，getAttribute()用于获取属性值。因此正确答案是B。"
        },
        {
          "id": "web-5-9",
          "type": "single",
          "text": "在JavaScript中，有var p=document.getElementById(\"data\"),则使用DOM将data对应内容设置为黄色的语句中正确的是( )。",
          "options": [
            {
              "k": "A",
              "t": "p.style.backgroundColor=\"yellow\""
            },
            {
              "k": "B",
              "t": "p.style.color=\"yellow\""
            },
            {
              "k": "C",
              "t": "p.color=\"yellow\""
            },
            {
              "k": "D",
              "t": "p.backgroundColor=\"yellow\""
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在JavaScript中，通过DOM获取元素后，设置CSS样式需通过style属性访问具体的CSS属性。背景色对应的CSS属性是backgroundColor，因此正确写法是p.style.backgroundColor=\"yellow\"。选项B设置的是文字颜色，选项C和D直接给元素对象添加属性，无法生效。"
        },
        {
          "id": "web-5-10",
          "type": "single",
          "text": "若字符串的indexOf方法查找失败，则返回( )。",
          "options": [
            {
              "k": "A",
              "t": "-1"
            },
            {
              "k": "B",
              "t": "null"
            },
            {
              "k": "C",
              "t": "false"
            },
            {
              "k": "D",
              "t": "0"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "JavaScript中，String.prototype.indexOf()方法在查找失败时返回-1，而不是null、false或0。这是该方法的固定行为，用于表示未找到子字符串。"
        },
        {
          "id": "web-5-11",
          "type": "single",
          "text": "下面关于事件的描述错误的是( )。",
          "options": [
            {
              "k": "A",
              "t": "事件处理程序指的是事件触发后要执行的代码"
            },
            {
              "k": "B",
              "t": "事件源是指触发事件的元素"
            },
            {
              "k": "C",
              "t": "事件指的是可以被JavaScript侦测到的行为"
            },
            {
              "k": "D",
              "t": "以上说法都不正确"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "选项A、B、C分别正确描述了事件处理程序、事件源和事件的定义。因此D选项“以上说法都不正确”是错误的，故本题选D。"
        },
        {
          "id": "web-5-12",
          "type": "single",
          "text": "下列选项中，可以实现创建元素的是( )。",
          "options": [
            {
              "k": "A",
              "t": "document.createElement(\"p\")"
            },
            {
              "k": "B",
              "t": "element.innerValue=\"你好\""
            },
            {
              "k": "C",
              "t": "element.pop(\"你好\")"
            },
            {
              "k": "D",
              "t": "element.push(\"你好\")"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "document.createElement() 是 DOM 方法，用于创建指定标签名的元素节点。其他选项：innerValue 不存在，pop 和 push 是数组方法，不能创建元素。"
        },
        {
          "id": "web-5-13",
          "type": "single",
          "text": "程序片段：var str1=\"12year\"; var i=str1.indexOf(\"2\"); alert(i);运行后，警告框消息为( )。",
          "options": [
            {
              "k": "A",
              "t": "1"
            },
            {
              "k": "B",
              "t": "2"
            },
            {
              "k": "C",
              "t": "12"
            },
            {
              "k": "D",
              "t": "p"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "indexOf方法返回指定字符在字符串中首次出现的位置索引，从0开始。字符串\"12year\"中字符\"2\"首次出现在索引1，因此alert(i)输出1。易错点：索引从0开始计数。"
        },
        {
          "id": "web-5-14",
          "type": "single",
          "text": "当调整window窗口大小的时候，就会触发的事件是( )。",
          "options": [
            {
              "k": "A",
              "t": "window.onload"
            },
            {
              "k": "B",
              "t": "document.DOMContentLoaded"
            },
            {
              "k": "C",
              "t": "window.innerWidth"
            },
            {
              "k": "D",
              "t": "window.onresize"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "window.onresize事件在窗口大小改变时触发。A选项window.onload在页面完全加载后触发，B选项DOMContentLoaded在DOM解析完成后触发，C选项window.innerWidth是属性而非事件。"
        },
        {
          "id": "web-5-15",
          "type": "multi",
          "text": "下列选项中,( )属于内置对象。",
          "options": [
            {
              "k": "A",
              "t": "Math"
            },
            {
              "k": "B",
              "t": "String"
            },
            {
              "k": "C",
              "t": "Date"
            },
            {
              "k": "D",
              "t": "Array"
            }
          ],
          "answer": [
            "A",
            "B",
            "C",
            "D"
          ],
          "analysis": "在JavaScript中，Math、String、Date和Array都是内置对象，它们由语言本身提供，无需额外引入即可使用。因此所有选项均正确。"
        },
        {
          "id": "web-5-16",
          "type": "multi",
          "text": "下列选项中属于文本节点的是( )。",
          "options": [
            {
              "k": "A",
              "t": "注释"
            },
            {
              "k": "B",
              "t": "元素"
            },
            {
              "k": "C",
              "t": "空格"
            },
            {
              "k": "D",
              "t": "换行"
            }
          ],
          "answer": [
            "C",
            "D"
          ],
          "analysis": "在DOM中，文本节点包括纯文本内容，如空格和换行符。注释是注释节点，元素是元素节点，因此只有空格和换行属于文本节点。"
        },
        {
          "id": "web-5-17",
          "type": "multi",
          "text": "下列选项中，属于JavaScript注释的是( )。",
          "options": [
            {
              "k": "A",
              "t": "`<!-- -->`"
            },
            {
              "k": "B",
              "t": "`/* */`"
            },
            {
              "k": "C",
              "t": "`#`"
            },
            {
              "k": "D",
              "t": "`//`"
            }
          ],
          "answer": [
            "B",
            "D"
          ],
          "analysis": "JavaScript支持两种注释：单行注释使用//，多行注释使用/* */。选项A是HTML注释，选项C是Python等语言的注释，不属于JavaScript。因此正确答案是B和D。"
        },
        {
          "id": "web-5-18",
          "type": "multi",
          "text": "下面属于符号\"+\"的功能是( )。",
          "options": [
            {
              "k": "A",
              "t": "正数"
            },
            {
              "k": "B",
              "t": "字符串连接"
            },
            {
              "k": "C",
              "t": "自增"
            },
            {
              "k": "D",
              "t": "相加"
            }
          ],
          "answer": [
            "A",
            "B",
            "D"
          ],
          "analysis": "在JavaScript中，'+'运算符具有多重功能：作为一元运算符表示正数（如+5），作为二元运算符用于字符串连接（如'a'+'b'）和数值相加（如1+2）。自增功能由'++'运算符实现，而非单独的'+'。因此正确选项为A、B、D。"
        },
        {
          "id": "web-5-19",
          "type": "judge",
          "text": "事件是指可以被JavaScript侦测到的行为，是一种\"触发-响应\"的机制。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "事件是JavaScript中用户操作或浏览器行为（如点击、加载）的触发点，通过监听事件并执行相应函数实现交互，符合“触发-响应”机制。"
        },
        {
          "id": "web-5-20",
          "type": "judge",
          "text": "JavaScript不声明变量的数据类型，变量可直接使用。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "JavaScript是弱类型语言，变量无需声明类型即可使用，且可随时改变数据类型。但严格模式下未声明变量会报错，本题基于常规情况判定正确。"
        },
        {
          "id": "web-5-21",
          "type": "judge",
          "text": "调用日期对象的getMonth()方法获取的月份，范围为1~12(1表示一月，2表示二月，依次类推)。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "getMonth()方法返回的月份是从0开始的整数，范围是0~11，其中0表示一月，1表示二月，依此类推。题目中描述为1~12是错误的，因此答案为false。"
        },
        {
          "id": "web-5-22",
          "type": "judge",
          "text": "JavaScript语言中，调用Math.random()可以获取0到1(包括0和1)之间的随机数。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "Math.random() 返回 [0, 1) 之间的随机浮点数，包括0但不包括1。题目说包括0和1，这是错误的，因为1不会被包含。"
        },
        {
          "id": "web-5-23",
          "type": "judge",
          "text": "JavaScript中的变量必须在声明的同时赋值。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "JavaScript中变量可以先声明后赋值，例如：let a; a = 1;。声明时赋值不是必须的，未赋值的变量默认值为undefined。"
        },
        {
          "id": "web-5-24",
          "type": "judge",
          "text": "调用document.getElementById(id)方法返回的是拥有指定id的元素。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "document.getElementById(id) 方法根据传入的 id 返回匹配的第一个元素对象，若不存在则返回 null。题干描述正确，注意该方法返回的是元素对象而非集合。"
        },
        {
          "id": "web-5-25",
          "type": "judge",
          "text": "JavaScript可以使用数组名[索引]的方式来访问数组元素。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "JavaScript中数组索引从0开始，通过方括号加索引即可访问对应元素，如arr[0]访问第一个元素。这是数组的基本操作，正确。"
        },
        {
          "id": "web-5-26",
          "type": "judge",
          "text": "使用var声明变量y后，alert(typeof y)将显示字符型。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "var声明的变量y未赋值时，typeof y返回'undefined'，而非字符型。字符型指字符串，typeof操作符对未初始化变量返回'undefined'字符串，但这是undefined类型，不是字符型。易错点：混淆typeof返回值与变量实际类型。"
        }
      ]
    },
    {
      "id": "web-6",
      "title": "六、JavaScript进阶",
      "questions": [
        {
          "id": "web-6-1",
          "type": "single",
          "text": "下面选项中，表示浏览器对象模型的是( )。",
          "options": [
            {
              "k": "A",
              "t": "BOM"
            },
            {
              "k": "B",
              "t": "window"
            },
            {
              "k": "C",
              "t": "DOM"
            },
            {
              "k": "D",
              "t": "document"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "浏览器对象模型（Browser Object Model）的缩写是BOM，它提供了与浏览器窗口交互的对象和方法。window是BOM的核心对象，但题目问的是表示浏览器对象模型的术语，因此选A。DOM是文档对象模型，document是DOM的一部分。"
        },
        {
          "id": "web-6-2",
          "type": "single",
          "text": "可获取当前元素对象ele所在层级的最后一个节点的是()。",
          "options": [
            {
              "k": "A",
              "t": "ele.parentNode"
            },
            {
              "k": "B",
              "t": "以上答案都不正确"
            },
            {
              "k": "C",
              "t": "ele.lastChild"
            },
            {
              "k": "D",
              "t": "ele.parentNode.lastChild"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "ele.parentNode 获取父节点；ele.lastChild 获取 ele 自身的最后一个子节点；ele.parentNode.lastChild 获取 ele 父节点的最后一个子节点，也就是 ele 所在同一层级中的最后一个节点。因此正确答案是 D。"
        },
        {
          "id": "web-6-3",
          "type": "single",
          "text": "Javascript中，需要声明一个整数变量num，以下语句正确的是( )。",
          "options": [
            {
              "k": "A",
              "t": "number num;"
            },
            {
              "k": "B",
              "t": "var num;"
            },
            {
              "k": "C",
              "t": "Integer num;"
            },
            {
              "k": "D",
              "t": "int num;"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "JavaScript是弱类型语言，声明变量使用var、let或const，不需要指定类型。选项B正确。其他选项如int、Integer、number是其他语言的语法，在JavaScript中无效。"
        },
        {
          "id": "web-6-4",
          "type": "single",
          "text": "'8'+8的结果是( )。",
          "options": [
            {
              "k": "A",
              "t": "undefined"
            },
            {
              "k": "B",
              "t": "88"
            },
            {
              "k": "C",
              "t": "NaN"
            },
            {
              "k": "D",
              "t": "16"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "在JavaScript中，当字符串与数字进行加法运算时，数字会被转换为字符串，然后进行字符串拼接。因此'8'+8的结果是字符串'88'，而不是数字16。易错点：误以为加法会进行数值计算。"
        },
        {
          "id": "web-6-5",
          "type": "single",
          "text": "下面关于字符串的描述错误的是( )。",
          "options": [
            {
              "k": "A",
              "t": "单引号中使用单引号不需要转义"
            },
            {
              "k": "B",
              "t": "双引号中使用单引号不需要转义"
            },
            {
              "k": "C",
              "t": "单引号或双引号包裹的数据称为字符串"
            },
            {
              "k": "D",
              "t": "双引号内使用换行需要转义"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "在JavaScript中，单引号内不能直接包含单引号，必须转义（如\\'），否则会语法错误。选项A说不需要转义是错误的。其他选项正确：双引号内可包含单引号无需转义；单引号或双引号包裹的是字符串；双引号内换行需转义（\\n）。"
        },
        {
          "id": "web-6-6",
          "type": "single",
          "text": "下列选项中，可以实现循环遍历页面中标签的是()。",
          "options": [
            {
              "k": "A",
              "t": "if(){}else{}"
            },
            {
              "k": "B",
              "t": "for(){}"
            },
            {
              "k": "C",
              "t": "if(){}"
            },
            {
              "k": "D",
              "t": "switch(){}"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "循环遍历需要使用循环结构，for(){}是循环语句，可以重复执行代码块来遍历元素。if、switch是条件语句，不能实现循环。"
        },
        {
          "id": "web-6-7",
          "type": "single",
          "text": "在网页中单击鼠标左键时会触发( )事件。",
          "options": [
            {
              "k": "A",
              "t": "clicks"
            },
            {
              "k": "B",
              "t": "dblclick"
            },
            {
              "k": "C",
              "t": "onclick"
            },
            {
              "k": "D",
              "t": "onfocus"
            }
          ],
          "answer": [
            "C"
          ],
          "analysis": "单击鼠标左键触发的是click事件，在HTML中通常使用onclick属性或addEventListener('click', handler)来绑定。选项A的'clicks'不是标准事件名；B的'dblclick'是双击事件；D的'onfocus'是获得焦点事件。因此正确答案是C。"
        },
        {
          "id": "web-6-8",
          "type": "single",
          "text": "执行程序代码var a;console.log(a);后控制台的输出结果为( )。",
          "options": [
            {
              "k": "A",
              "t": "null"
            },
            {
              "k": "B",
              "t": "0"
            },
            {
              "k": "C",
              "t": "\"\""
            },
            {
              "k": "D",
              "t": "undefined"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "在JavaScript中，使用var声明变量但未初始化时，变量的默认值为undefined。因此执行var a;后，a的值为undefined，console.log(a)输出undefined。易错点：null是主动赋值的空值，与undefined不同。"
        },
        {
          "id": "web-6-9",
          "type": "single",
          "text": "为了实现3秒后自动关闭广告的效果，可以使用( )来实现。",
          "options": [
            {
              "k": "A",
              "t": "setInterval()"
            },
            {
              "k": "B",
              "t": "clearInterval()"
            },
            {
              "k": "C",
              "t": "clearTimeout()"
            },
            {
              "k": "D",
              "t": "setTimeout()"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "setTimeout()用于在指定延迟后执行一次函数，适合实现3秒后自动关闭广告。setInterval()会重复执行，不符合需求。clearTimeout()和clearInterval()用于取消定时器，不能直接实现延迟执行。"
        },
        {
          "id": "web-6-10",
          "type": "single",
          "text": "HTML DOM中的根节点是( )。",
          "options": [
            {
              "k": "A",
              "t": "head"
            },
            {
              "k": "B",
              "t": "div"
            },
            {
              "k": "C",
              "t": "window"
            },
            {
              "k": "D",
              "t": "document"
            }
          ],
          "answer": [
            "D"
          ],
          "analysis": "在HTML DOM中，根节点是document对象，它代表整个HTML文档，是所有其他节点的父节点。head和div是元素节点，window是BOM对象，不是DOM根节点。"
        },
        {
          "id": "web-6-11",
          "type": "multi",
          "text": "下面选项中，( )属于清除定时器方法。",
          "options": [
            {
              "k": "A",
              "t": "clearInterval()"
            },
            {
              "k": "B",
              "t": "setInterval()"
            },
            {
              "k": "C",
              "t": "setTimeout()"
            },
            {
              "k": "D",
              "t": "clearTimeout()"
            }
          ],
          "answer": [
            "A",
            "D"
          ],
          "analysis": "清除定时器的方法包括clearInterval()用于清除setInterval()创建的定时器，以及clearTimeout()用于清除setTimeout()创建的定时器。setInterval()和setTimeout()是创建定时器的方法，不是清除方法。"
        },
        {
          "id": "web-6-12",
          "type": "multi",
          "text": "下列选项中，可以获取当前元素节点的兄弟节点的是( )。",
          "options": [
            {
              "k": "A",
              "t": "childNodes"
            },
            {
              "k": "B",
              "t": "nextSibling"
            },
            {
              "k": "C",
              "t": "parentNode"
            },
            {
              "k": "D",
              "t": "previousSibling"
            }
          ],
          "answer": [
            "B",
            "D"
          ],
          "analysis": "nextSibling 获取下一个兄弟节点，previousSibling 获取上一个兄弟节点，两者均可获取兄弟节点。childNodes 获取子节点，parentNode 获取父节点，均不符合题意。"
        },
        {
          "id": "web-6-13",
          "type": "judge",
          "text": "JavaScript不可以跨平台。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "JavaScript可以在多种平台上运行，包括浏览器、服务器（Node.js）、移动端等，因此具有跨平台特性。题干说法错误。"
        },
        {
          "id": "web-6-14",
          "type": "judge",
          "text": "在JavaScript中，使用childNodes属性和children属性获得的对象是一样的。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "childNodes 返回包含文本节点和注释节点的 NodeList，而 children 只返回元素节点。因此两者返回的对象不同，尤其在存在空白文本节点时差异明显。"
        },
        {
          "id": "web-6-15",
          "type": "judge",
          "text": "JavaScript中的循环跳转语句break和continue作用完全相同。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "break用于立即终止整个循环，而continue仅跳过当前迭代，继续下一次循环。两者作用不同，因此该说法错误。易错点在于混淆两者功能。"
        },
        {
          "id": "web-6-16",
          "type": "judge",
          "text": "使用var声明变量y后，alert(typeof y)将显示字符型。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "B"
          ],
          "analysis": "var声明的变量y未赋值时，typeof y返回'undefined'，而非字符型。typeof运算符的结果是字符串，但这里指变量类型为undefined，不是字符型。易错点：混淆typeof返回值的类型与变量实际类型。"
        },
        {
          "id": "web-6-17",
          "type": "judge",
          "text": "JavaScript提供的常用内置对象包括字符串对象、数学对象、日期对象、数组对象。( )",
          "options": [
            {
              "k": "A",
              "t": "正确"
            },
            {
              "k": "B",
              "t": "错误"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "JavaScript确实提供了这些常用内置对象：String、Math、Date、Array，它们都是全局对象，可直接使用。题目表述正确，注意内置对象无需实例化即可调用其静态方法，但String和Array通常以实例形式使用。"
        },
        {
          "id": "web-6-18",
          "type": "single",
          "text": "阅读下面的代码，执行后控制台两行依次输出的是（　）\n\n```javascript\nvar funcs = [];\nfor (var i = 0; i < 3; i++) {\n  funcs.push(function () { return i; });\n}\nconsole.log(funcs[0](), funcs[1](), funcs[2]());\n\nvar lets = [];\nfor (let j = 0; j < 3; j++) {\n  lets.push(function () { return j; });\n}\nconsole.log(lets[0](), lets[1](), lets[2]());\n```",
          "options": [
            {
              "k": "A",
              "t": "第一行 `3 3 3`，第二行 `0 1 2`"
            },
            {
              "k": "B",
              "t": "第一行 `0 1 2`，第二行 `0 1 2`"
            },
            {
              "k": "C",
              "t": "第一行 `3 3 3`，第二行 `3 3 3`"
            },
            {
              "k": "D",
              "t": "第一行 `0 1 2`，第二行 `3 3 3`"
            },
            {
              "k": "E",
              "t": "代码直接抛错，因为 let 不能用在 for 循环里"
            }
          ],
          "answer": [
            "A"
          ],
          "analysis": "第一段用 var 声明的 i 属于函数作用域，整个循环从头到尾共用同一个变量。循环结束时 i 已经加到 3，三个闭包读到的都是这同一个 i，所以输出 `3 3 3`。第二段用 let 声明的 j 属于块级作用域，for 循环的每一次迭代都会创建一个新的绑定，并把当次的值捕获进那个闭包，因此三个函数分别返回 0、1、2。E 是明显的错误说法，let 完全可以用在 for 循环里，这正是它相对 var 的改进之一。故选 A。"
        }
      ]
    }
  ]
};
