// ========== 关卡数据 + 运行时 ==========
// HTML 建造世界 10 关（v3：边玩边学 · 工地场景 · 海狸助手）
// buildPreview(code) 控制 iframe 内容；check(code, doc, win) 判题
(function () {
  'use strict';

  // 转义用户代码中的 </script>，避免截断 iframe HTML
  function safeCode(code) {
    return String(code).replace(/<\/script>/gi, '<\\/script>');
  }

  // ===== 关卡数据 =====
  const LEVELS = {
// ---------- 第 1 关：第一块砖（h1） ----------
    html: [
    {
      id: 'html-1', langId: 'html', index: 1,
      title: '第一块砖', subtitle: 'First Brick',
      narrative: '欢迎来到建造世界！你是见习建造师，空地上画好了地基。海狸助手说：用 <h1> 标签立起你的第一块招牌吧。目标：创建 <h1>施工中</h1>。',
      knowledge: [
        '标签 = 建筑材料，成对出现：开标签 <h1> 和闭标签 </h1>',
        '开标签与闭标签之间写内容，内容会显示在页面上',
        'h1 是一级标题，字最大，用来立招牌'
      ],
      starterCode: '<!-- 海狸：在下面写一个 <h1> 标签，中间写"施工中" -->\n',
      solution: '<h1>施工中</h1>',
      hint: '分三步：① 写开标签 <h1>；② 在中间写文字"施工中"；③ 写闭标签 </h1>。',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .ground::before{content:'⚠ 施工区域 ⚠';position:absolute;top:-26px;left:50%;transform:translateX(-50%);
             background:#f5a623;color:#1a2332;font-weight:bold;font-size:12px;padding:4px 18px;border-radius:4px;letter-spacing:2px}
        .blueprint{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center;
             background:repeating-linear-gradient(45deg,rgba(120,180,255,.06) 0 12px,transparent 12px 24px)}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .beaver-talk::before{content:'';position:absolute;left:-8px;bottom:14px;border:8px solid transparent;border-right-color:rgba(255,255,255,.95)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        h1{font-size:44px;color:#f5a623;text-shadow:0 4px 20px rgba(245,166,35,.5);margin:0;padding:14px 30px;
           border:3px solid #f5a623;background:rgba(245,166,35,.1);border-radius:8px;opacity:0}
        h1.show{opacity:1;animation:rise .8s cubic-bezier(.34,1.56,.64,1) both}
        @keyframes rise{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        .foundation{position:absolute;left:50%;bottom:34%;transform:translateX(-50%);width:320px;height:18px;
           background:repeating-linear-gradient(90deg,#8a9ab0 0 20px,#6a7a90 20px 40px);border-radius:4px;z-index:1;
           border:2px dashed #f5a623}
        .foundation::after{content:'地基';position:absolute;top:-22px;left:50%;transform:translateX(-50%);color:#8a9ab0;font-size:12px;letter-spacing:4px}
      </style></head><body>
        <div class="ground"></div>
        <div class="foundation"></div>
        <div class="status-msg" id="status">工地已就绪，立起你的第一块招牌…</div>
        <div class="blueprint">${safeCode(code)}</div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">欢迎来到建造世界！用 &lt;h1&gt; 标签立起你的第一块招牌吧！</div></div>
        <script>
          (function(){
            const h1=document.querySelector('h1');
            const status=document.getElementById('status');
            if(h1 && h1.textContent.trim()){
              h1.classList.add('show');
              status.textContent='✓ 招牌立起来了！工地有了名字';
              status.classList.add('ok');
            }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          const m = code.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
          if (!m) return { passed: false, message: '还没有 <h1> 招牌。先写 <h1> 开头、</h1> 结尾。' };
          if (!m[1].trim()) return { passed: false, message: '<h1> 里是空的，写点文字（如"施工中"）。' };
          return { passed: true, message: '第一块招牌立起来了！' };
        }
        const h1 = doc.querySelector('h1');
        if (!h1) return { passed: false, message: '还没有 <h1> 招牌。先写 <h1> 开头、</h1> 结尾。' };
        if (!h1.textContent.trim()) return { passed: false, message: '<h1> 里是空的，写点文字（如"施工中"）。' };
        return { passed: true, message: '第一块招牌立起来了！' };
      }
    },
    {
      id: 'html-2', langId: 'html', index: 2,
      title: '段落堆积', subtitle: 'Paragraph Pile',
      narrative: '招牌已经立好。海狸说：用 <p> 标签在招牌下方加一段描述文字，让工地信息更完整。目标：创建内容非空的 <p> 段落。',
      knowledge: [
        'p 是段落标签，用来放一段描述文字',
        '不同标签产生不同元素：h1 是大标题，p 是正文段落',
        'p 也成对出现：<p> 内容 </p>'
      ],
      starterCode: '<!-- 海狸：在招牌下方写一个 <p> 标签，里面写一句描述 -->\n',
      solution: '<p>这里正在建造一座魔法塔</p>',
      hint: '写 <p> 开头、内容文字、</p> 结尾，例如 <p>这里是工地</p>。',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .ground::before{content:'⚠ 施工区域 ⚠';position:absolute;top:-26px;left:50%;transform:translateX(-50%);
             background:#f5a623;color:#1a2332;font-weight:bold;font-size:12px;padding:4px 18px;border-radius:4px;letter-spacing:2px}
        .blueprint{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center;
             background:repeating-linear-gradient(45deg,rgba(120,180,255,.06) 0 12px,transparent 12px 24px)}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .beaver-talk::before{content:'';position:absolute;left:-8px;bottom:14px;border:8px solid transparent;border-right-color:rgba(255,255,255,.95)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        .sign{font-size:32px;color:#f5a623;border:3px solid #f5a623;padding:10px 24px;border-radius:8px;
           background:rgba(245,166,35,.08);margin-bottom:16px;font-weight:bold}
        p{font-size:18px;color:#d8e4f0;line-height:1.8;max-width:480px;opacity:0;background:rgba(255,255,255,.06);
           padding:12px 20px;border-radius:8px;border-left:4px solid #4a90d9}
        p.show{opacity:1;animation:rise .7s ease both}
        @keyframes rise{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
        .hint-line{font-size:12px;color:#8a9ab0;letter-spacing:2px}
      </style></head><body>
        <div class="ground"></div>
        <div class="status-msg" id="status">招牌立好了，再写一段描述文字…</div>
        <div class="blueprint">
          <div class="sign">🏗️ 魔法塔施工现场</div>
          ${safeCode(code)}
          <div class="hint-line">↑ 这里加一段描述</div>
        </div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">招牌不错！再用 &lt;p&gt; 加一段说明文字吧</div></div>
        <script>
          (function(){
            const p=document.querySelector('p');
            const status=document.getElementById('status');
            if(p && p.textContent.trim()){
              p.classList.add('show');
              status.textContent='✓ 描述文字出现了！';
              status.classList.add('ok');
            }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          const m = code.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
          if (!m) return { passed: false, message: '还没有 <p> 段落。写 <p> 开头、</p> 结尾。' };
          if (!m[1].trim()) return { passed: false, message: '<p> 里是空的，写一句描述文字。' };
          return { passed: true, message: '描述文字出现了！' };
        }
        const p = doc.querySelector('p');
        if (!p) return { passed: false, message: '还没有 <p> 段落。写 <p> 开头、</p> 结尾。' };
        if (!p.textContent.trim()) return { passed: false, message: '<p> 里是空的，写一句描述文字。' };
        return { passed: true, message: '描述文字出现了！' };
      }
    },
    {
      id: 'html-3', langId: 'html', index: 3,
      title: '图片挂载', subtitle: 'Mount the Image',
      narrative: '工地的墙上有一个空相框。海狸说：用 <img> 标签给相框装上图片。目标：创建带 src 属性的 <img> 标签。',
      knowledge: [
        'img 是图片标签，用 src 属性告诉浏览器图片在哪里',
        'img 是「单标签」（自闭合标签），不需要成对：<img src="图片地址">',
        'src 是属性，写在开标签里：属性 = 标签的特殊功能'
      ],
      starterCode: '<!-- 海狸：写一个 <img> 标签，用 src 属性指向一张图片 -->\n<!-- 提示：src 里可以填 https:// 开头的图片网址 -->\n<img src="">',
      solution: '<img src="https://picsum.photos/200/150">',
      hint: '写 <img src="图片地址">。src 属性要填一个非空的图片网址，比如 https://picsum.photos/200/150',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .blueprint{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center;
             background:repeating-linear-gradient(45deg,rgba(120,180,255,.06) 0 12px,transparent 12px 24px)}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        .frame{width:240px;height:180px;border:6px solid #8a6d3b;background:rgba(255,255,255,.08);
           display:flex;align-items:center;justify-content:center;border-radius:6px;position:relative;overflow:hidden}
        .frame .ph{color:#8a9ab0;font-size:14px;letter-spacing:2px}
        .frame img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .5s ease}
        .frame img.show{opacity:1;animation:pop .5s ease both}
        @keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        .frame.done{border-color:#00c878;box-shadow:0 0 24px rgba(0,200,120,.5)}
        .frame-label{font-size:12px;color:#8a9ab0;margin-top:10px;letter-spacing:2px}
      </style></head><body>
        <div class="ground"></div>
        <div class="status-msg" id="status">墙上有个空相框，给它装上图片…</div>
        <div class="blueprint">
          <div class="frame" id="frame"><span class="ph">🖼️ 空相框</span></div>
          <div class="frame-label">↕ 用 &lt;img&gt; 挂载图片</div>
          ${safeCode(code)}
        </div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">用 &lt;img&gt; 标签给相框装上图片！记得用 src 属性</div></div>
        <script>
          (function(){
            const img=document.querySelector('img');
            const frame=document.getElementById('frame');
            const status=document.getElementById('status');
            if(img && img.getAttribute('src') && img.getAttribute('src').trim()){
              const ph=frame.querySelector('.ph'); if(ph) ph.remove();
              img.classList.add('show');
              frame.classList.add('done');
              status.textContent='✓ 相框装上了图片！';
              status.classList.add('ok');
            }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          const m = code.match(/<img[^>]*src\s*=\s*["']([^"']+)["']/i);
          if (!m) return { passed: false, message: '还没有带 src 的 <img> 标签。写 <img src="图片地址">' };
          if (!m[1].trim()) return { passed: false, message: 'src 是空的，填一个图片网址。' };
          return { passed: true, message: '相框装上了图片！' };
        }
        const img = doc.querySelector('img');
        if (!img) return { passed: false, message: '还没有 <img> 标签。写 <img src="图片地址">' };
        const src = img.getAttribute('src');
        if (!src || !src.trim()) return { passed: false, message: 'src 是空的，填一个图片网址。' };
        return { passed: true, message: '相框装上了图片！' };
      }
    },
    {
      id: 'html-4', langId: 'html', index: 4,
      title: '链接搭建', subtitle: 'Build the Bridge',
      narrative: '两座孤岛隔海相望，工人们过不去。海狸说：用 <a> 标签建一座可点击的桥。目标：创建带 href 属性的 <a> 链接。',
      knowledge: [
        'a 是链接（锚点）标签，用来跳转或导航',
        'href 属性填写目标地址，是链接的"桥面"',
        'a 成对出现：<a href="地址">桥的名字</a>，中间的文字是点的地方'
      ],
      starterCode: '<!-- 海狸：写一个 <a> 标签，用 href 属性指向对岸 -->\n<!-- 中间写桥的名字 -->\n',
      solution: '<a href="https://example.com">走过这座桥</a>',
      hint: '写 <a href="网址">文字</a>。href 要填非空地址，文字写桥的名字。',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .sea{position:absolute;left:0;right:0;bottom:34%;height:40%;background:linear-gradient(180deg,#2a6a9a,#1a4a6a);z-index:1}
        .island{position:absolute;bottom:44%;width:130px;height:60px;background:#4a5a3a;border-radius:50% 50% 0 0;z-index:2;
           display:flex;align-items:center;justify-content:center;font-size:12px;color:#a8b8a0}
        .island.a{left:12%}.island.b{right:12%}
        .bridge-zone{position:absolute;left:30%;right:30%;bottom:52%;z-index:3;text-align:center}
        a{display:inline-block;color:#fff;font-size:16px;background:rgba(245,166,35,.2);border:2px solid #f5a623;
           padding:10px 22px;border-radius:8px;text-decoration:none;opacity:0}
        a.show{opacity:1;animation:pop .6s ease both;background:#f5a623;color:#1a2332;font-weight:bold;
           box-shadow:0 0 20px rgba(245,166,35,.6)}
        @keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        .bridge{position:absolute;left:24%;right:24%;bottom:58%;height:6px;background:#8a6d3b;z-index:2;opacity:0;border-radius:3px}
        .bridge.show{opacity:1;animation:rise .8s ease both}
        @keyframes rise{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
      </style></head><body>
        <div class="ground"></div>
        <div class="sea"></div>
        <div class="island a">🏝️ 工地</div>
        <div class="island b">🏝️ 仓库</div>
        <div class="bridge" id="bridge"></div>
        <div class="status-msg" id="status">两座岛隔海相望，造一座桥吧…</div>
        <div class="bridge-zone">${safeCode(code)}</div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">用 &lt;a&gt; 标签建桥！href 属性指向对岸</div></div>
        <script>
          (function(){
            const a=document.querySelector('a');
            const bridge=document.getElementById('bridge');
            const status=document.getElementById('status');
            if(a && a.getAttribute('href') && a.getAttribute('href').trim()){
              a.classList.add('show');
              bridge.classList.add('show');
              status.textContent='✓ 桥面铺开了，可以走过去！';
              status.classList.add('ok');
            }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          const m = code.match(/<a[^>]*href\s*=\s*["']([^"']+)["']/i);
          if (!m) return { passed: false, message: '还没有带 href 的 <a> 链接。写 <a href="地址">文字</a>' };
          if (!m[1].trim()) return { passed: false, message: 'href 是空的，填一个目标地址。' };
          return { passed: true, message: '桥面铺开，可以过桥了！' };
        }
        const a = doc.querySelector('a');
        if (!a) return { passed: false, message: '还没有 <a> 链接。写 <a href="地址">文字</a>' };
        const href = a.getAttribute('href');
        if (!href || !href.trim()) return { passed: false, message: 'href 是空的，填一个目标地址。' };
        return { passed: true, message: '桥面铺开，可以过桥了！' };
      }
    },
    {
      id: 'html-5', langId: 'html', index: 5,
      title: '列表排列', subtitle: 'Supply List',
      narrative: '仓库门口要贴物资清单。海狸说：用 <ul> 和 <li> 列出 3 种物资。目标：ul 内包含至少 3 个 li。',
      knowledge: [
        'ul 是无序列表容器，li 是列表项',
        '嵌套结构：li 要放在 ul 里面（ul > li）',
        '一个 li 一项物资，一 li 一物'
      ],
      starterCode: '<!-- 海狸：写一个 <ul> 列表，里面放 3 个 <li> -->\n<!-- 每个 <li> 里写一种物资名 -->\n',
      solution: '<ul><li>钢筋</li><li>水泥</li><li>砖块</li></ul>',
      hint: '把 <ul> 里的 3 个 <li> 都填上物资名，比如钢筋、水泥、砖块。',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .blueprint{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center;
             background:repeating-linear-gradient(45deg,rgba(120,180,255,.06) 0 12px,transparent 12px 24px)}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        ul{list-style:none;padding:0;display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
        li{background:rgba(245,166,35,.12);border:2px solid #f5a623;color:#ffd98a;font-size:15px;
           padding:14px 22px;border-radius:8px;min-width:80px;text-align:center;opacity:0}
        li.show{opacity:1;animation:pop .5s ease both}
        @keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        li.empty{opacity:1;border-style:dashed;color:#8a9ab0;background:rgba(255,255,255,.05)}
        .hint-line{font-size:12px;color:#8a9ab0;letter-spacing:2px;margin-top:18px}
      </style></head><body>
        <div class="ground"></div>
        <div class="status-msg" id="status">仓库门口需要一份物资清单…</div>
        <div class="blueprint">
          <div style="font-size:20px;margin-bottom:8px">📦 工地物资清单</div>
          ${safeCode(code)}
          <div class="hint-line">↑ 填满 3 个物资项</div>
        </div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">用 &lt;ul&gt; 和 &lt;li&gt; 列出 3 种物资！</div></div>
        <script>
          (function(){
            const lis=[...document.querySelectorAll('li')];
            const status=document.getElementById('status');
            lis.forEach(li=>{
              if(li.textContent.trim()){ li.classList.remove('empty'); li.classList.add('show'); }
              else li.classList.add('empty');
            });
            const filled=lis.filter(li=>li.textContent.trim()).length;
            if(filled>=3){ status.textContent='✓ 3 种物资都列好了！'; status.classList.add('ok'); }
            else if(filled>0){ status.textContent='清单已有 '+filled+' 项，还差 '+(3-filled)+' 项…'; }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          const hasUl = /<ul[\s>]/i.test(code);
          const lis = (code.match(/<li[\s>]/g) || []).length;
          if (!hasUl) return { passed: false, message: '没有 <ul> 列表。先写 <ul> 开头、</ul> 结尾。' };
          if (lis < 3) return { passed: false, message: `列表里只有 ${lis} 个 <li>，需要 3 个。` };
          return { passed: true, message: '3 种物资列好了！' };
        }
        const ul = doc.querySelector('ul');
        if (!ul) return { passed: false, message: '没有 <ul> 列表。先写 <ul> 开头、</ul> 结尾。' };
        const lis = [...ul.querySelectorAll('li')];
        if (lis.length < 3) return { passed: false, message: `列表里只有 ${lis.length} 个 <li>，需要 3 个。` };
        if (lis.some(li => !li.textContent.trim())) return { passed: false, message: '有 <li> 是空的，给每个都填上物资名。' };
        return { passed: true, message: '3 种物资列好了！' };
      }
    },
    {
      id: 'html-6', langId: 'html', index: 6,
      title: '结构分区', subtitle: 'Room Plan',
      narrative: '一栋房子还没分房间。海狸说：用 <div> 划分出"客厅"和"厨房"两个区域。目标：至少 2 个内容不同的 div。',
      knowledge: [
        'div 是容器标签，用来给页面分区',
        '每个 div 可以装不同内容，形成不同区域',
        'div 成对出现：<div> 内容 </div>'
      ],
      starterCode: '<!-- 海狸：用 2 个 <div> 划分出客厅和厨房 -->\n<div></div>\n<div></div>',
      solution: '<div>客厅</div><div>厨房</div>',
      hint: '写两个 <div>，一个里面写"客厅"，另一个写"厨房"。',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .blueprint{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center;
             background:repeating-linear-gradient(45deg,rgba(120,180,255,.06) 0 12px,transparent 12px 24px)}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        .house{width:min(420px,90%);border:4px solid #8a6d3b;background:rgba(255,255,255,.04);border-radius:8px;
           padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px;min-height:160px}
        div{min-height:70px;border-radius:6px;display:flex;align-items:center;justify-content:center;
           font-size:16px;opacity:0;padding:8px}
        div.show{opacity:1;animation:pop .6s ease both}
        @keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        div.room1{background:rgba(74,144,217,.2);border:2px solid #4a90d9;color:#a8c8e8}
        div.room2{background:rgba(0,200,120,.2);border:2px solid #00c878;color:#a0e8c0}
        div.plain{background:rgba(255,255,255,.06);border:1px dashed #8a9ab0;color:#8a9ab0}
        .hint-line{font-size:12px;color:#8a9ab0;letter-spacing:2px;margin-top:16px}
      </style></head><body>
        <div class="ground"></div>
        <div class="status-msg" id="status">房子还没分区，用 div 划分房间…</div>
        <div class="blueprint">
          <div class="house" id="house">${safeCode(code)}</div>
          <div class="hint-line">↑ 客厅 和 厨房</div>
        </div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">用 &lt;div&gt; 把房子分成客厅和厨房！</div></div>
        <script>
          (function(){
            const divs=[...document.querySelectorAll('#house > div')];
            const status=document.getElementById('status');
            divs.forEach((d,i)=>{
              if(d.textContent.trim()){
                d.classList.remove('plain');
                d.classList.add(i%2===0?'room1':'room2','show');
              } else { d.classList.add('plain','show'); }
            });
            const filled=divs.filter(d=>d.textContent.trim()).length;
            if(filled>=2){ status.textContent='✓ 客厅和厨房都分好了！'; status.classList.add('ok'); }
            else if(filled===1){ status.textContent='已有一个房间，还差一个…'; }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          const divs = [...code.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/gi)];
          if (divs.length < 2) return { passed: false, message: `只有 ${divs.length} 个 <div>，需要至少 2 个。` };
          if (divs.filter(d => d[1].trim()).length < 2) return { passed: false, message: 'div 里要有内容，比如"客厅"和"厨房"。' };
          return { passed: true, message: '房间分区完成！' };
        }
        const divs = [...doc.querySelectorAll('div')].filter(d => d.textContent.trim());
        if (divs.length < 2) return { passed: false, message: `只有 ${divs.length} 个有内容的 <div>，需要至少 2 个。` };
        return { passed: true, message: '房间分区完成！' };
      }
    },
    {
      id: 'html-7', langId: 'html', index: 7,
      title: '表格搭建', subtitle: 'Build the Table',
      narrative: '工地需要一张施工进度表。海狸说：用 <table> <tr> <td> 创建 2 行 2 列的表格。目标：table 内包含 tr 和 td。',
      knowledge: [
        'table 是表格容器，tr 是表格行，td 是单元格',
        '嵌套结构：table > tr > td（行里放单元格）',
        '2 行 2 列 = 2 个 tr，每个 tr 里 2 个 td'
      ],
      starterCode: '<!-- 海狸：创建 2 行 2 列的表格 -->\n<!-- 用 <table> <tr> <td> 组合 -->\n',
      solution: '<table><tr><td>任务</td><td>进度</td></tr><tr><td>打地基</td><td>完成</td></tr></table>',
      hint: '表格里填点内容，比如第一行写"任务/进度"，第二行写"打地基/完成"。',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .blueprint{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center;
             background:repeating-linear-gradient(45deg,rgba(120,180,255,.06) 0 12px,transparent 12px 24px)}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        .board{width:min(380px,90%);border:4px solid #8a6d3b;background:rgba(255,255,255,.06);border-radius:6px;padding:14px}
        .board-title{font-size:14px;color:#ffd98a;letter-spacing:2px;margin-bottom:10px;text-align:center}
        table{width:100%;border-collapse:collapse;opacity:0}
        table.show{opacity:1;animation:rise .7s ease both}
        @keyframes rise{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        td{border:2px solid #8a6d3b;padding:10px;text-align:center;color:#d8e4f0;font-size:14px}
        td.empty{color:#8a9ab0;font-style:italic}
        .hint-line{font-size:12px;color:#8a9ab0;letter-spacing:2px;margin-top:16px;text-align:center}
      </style></head><body>
        <div class="ground"></div>
        <div class="status-msg" id="status">施工进度表还是空的…</div>
        <div class="blueprint">
          <div class="board">
            <div class="board-title">📋 施工进度表</div>
            ${safeCode(code)}
          </div>
          <div class="hint-line">↑ 填好 2×2 表格</div>
        </div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">用 &lt;table&gt; &lt;tr&gt; &lt;td&gt; 建一张 2 行 2 列表格！</div></div>
        <script>
          (function(){
            const table=document.querySelector('table');
            const status=document.getElementById('status');
            if(table){
              const trs=[...table.querySelectorAll('tr')];
              const tds=[...table.querySelectorAll('td')];
              tds.forEach(td=>{ if(!td.textContent.trim()) td.classList.add('empty'); });
              if(trs.length>=2 && tds.length>=4){
                table.classList.add('show');
                status.textContent='✓ 进度表搭好了！';
                status.classList.add('ok');
              } else if(trs.length||tds.length){
                status.textContent='表格在生长…需要 2 行 2 列';
              }
            }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          if (!/<table[\s>]/i.test(code)) return { passed: false, message: '没有 <table> 表格。先写 <table> 开头。' };
          const trs = (code.match(/<tr[\s>]/gi) || []).length;
          const tds = (code.match(/<td[\s>]/gi) || []).length;
          if (trs < 2) return { passed: false, message: `只有 ${trs} 行（tr），需要 2 行。` };
          if (tds < 4) return { passed: false, message: `只有 ${tds} 个单元格（td），需要 4 个（2×2）。` };
          return { passed: true, message: '2×2 表格搭好了！' };
        }
        const table = doc.querySelector('table');
        if (!table) return { passed: false, message: '没有 <table> 表格。先写 <table> 开头。' };
        const trs = [...table.querySelectorAll('tr')];
        const tds = [...table.querySelectorAll('td')];
        if (trs.length < 2) return { passed: false, message: `只有 ${trs.length} 行（tr），需要 2 行。` };
        if (tds.length < 4) return { passed: false, message: `只有 ${tds.length} 个单元格（td），需要 4 个（2×2）。` };
        return { passed: true, message: '2×2 表格搭好了！' };
      }
    },
    {
      id: 'html-8', langId: 'html', index: 8,
      title: '表单初识', subtitle: 'Visitor Form',
      narrative: '工地入口需要访客登记。海狸说：用 <input> 创建姓名输入框。目标：创建 <input> 输入框。',
      knowledge: [
        'input 是输入框标签，用户可以在里面打字',
        'input 是单标签，不需要闭合',
        'type 属性可以改类型：type="text" 是文本输入框'
      ],
      starterCode: '<!-- 海狸：在登记台创建一个姓名输入框 -->\n<!-- 写一个 input 标签（不需要闭合） -->\n',
      solution: '<input type="text" placeholder="请输入姓名">',
      hint: '写 <input type="text">。可以加 placeholder="请输入姓名" 显示提示文字。',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .blueprint{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center;
             background:repeating-linear-gradient(45deg,rgba(120,180,255,.06) 0 12px,transparent 12px 24px)}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        .desk{width:min(360px,90%);background:rgba(255,255,255,.06);border:3px solid #8a6d3b;border-radius:8px;
           padding:20px;text-align:center}
        .desk-title{font-size:16px;color:#ffd98a;margin-bottom:14px;letter-spacing:2px}
        input{width:80%;padding:12px 16px;font-size:15px;border:2px solid #4a90d9;border-radius:6px;
           background:rgba(255,255,255,.1);color:#fff;outline:none;opacity:0}
        input.show{opacity:1;animation:pop .6s ease both}
        @keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        input:focus{border-color:#00c878;box-shadow:0 0 12px rgba(0,200,120,.4)}
        .hint-line{font-size:12px;color:#8a9ab0;letter-spacing:2px;margin-top:14px}
      </style></head><body>
        <div class="ground"></div>
        <div class="status-msg" id="status">工地入口需要访客登记…</div>
        <div class="blueprint">
          <div class="desk">
            <div class="desk-title">🚧 访客登记处</div>
            ${safeCode(code)}
            <div class="hint-line">↑ 姓名输入框</div>
          </div>
        </div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">用 &lt;input&gt; 做一个姓名输入框！</div></div>
        <script>
          (function(){
            const input=document.querySelector('input');
            const status=document.getElementById('status');
            if(input){
              input.classList.add('show');
              status.textContent='✓ 输入框就位，可以登记了！';
              status.classList.add('ok');
            }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          if (!/<input[\s>]/i.test(code)) return { passed: false, message: '没有 <input> 输入框。写 <input type="text">' };
          return { passed: true, message: '输入框就位！' };
        }
        const input = doc.querySelector('input');
        if (!input) return { passed: false, message: '没有 <input> 输入框。写 <input type="text">' };
        return { passed: true, message: '输入框就位！' };
      }
    },
    {
      id: 'html-9', langId: 'html', index: 9,
      title: '按钮触发', subtitle: 'Start Button',
      narrative: '控制台前需要一个启动按钮。海狸说：用 <button> 创建"启动施工"按钮。目标：创建带文字的 <button> 按钮。',
      knowledge: [
        'button 是按钮标签，点击会有动作',
        'button 成对出现，中间的文字就是按钮上显示的字',
        '按钮是"可点击元素"，是页面交互的入口'
      ],
      starterCode: '<!-- 海狸：创建一个"启动施工"按钮 -->\n<button></button>',
      solution: '<button>启动施工</button>',
      hint: '写 <button> 启动施工 </button>，中间填按钮显示的文字。',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .blueprint{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center;
             background:repeating-linear-gradient(45deg,rgba(120,180,255,.06) 0 12px,transparent 12px 24px)}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        .console{width:min(400px,90%);background:rgba(26,35,50,.8);border:3px solid #4a90d9;border-radius:10px;
           padding:24px;text-align:center}
        .console-title{font-size:14px;color:#8ab8e8;letter-spacing:3px;margin-bottom:18px}
        button{font-size:18px;font-weight:bold;color:#1a2332;background:#f5a623;border:none;padding:14px 36px;
           border-radius:8px;cursor:pointer;opacity:0;transition:all .3s ease}
        button.show{opacity:1;animation:pop .6s ease both}
        @keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        button:hover{transform:translateY(-2px);filter:brightness(1.1)}
        .hint-line{font-size:12px;color:#8a9ab0;letter-spacing:2px;margin-top:16px}
      </style></head><body>
        <div class="ground"></div>
        <div class="status-msg" id="status">控制台待命，需要一个启动按钮…</div>
        <div class="blueprint">
          <div class="console">
            <div class="console-title">⚙️ 施工控制台</div>
            ${safeCode(code)}
            <div class="hint-line">↑ 启动按钮</div>
          </div>
        </div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">用 &lt;button&gt; 创建"启动施工"按钮！</div></div>
        <script>
          (function(){
            const btn=document.querySelector('button');
            const status=document.getElementById('status');
            if(btn && btn.textContent.trim()){
              btn.classList.add('show');
              status.textContent='✓ 启动按钮就位！';
              status.classList.add('ok');
              btn.addEventListener('click',()=>{
                status.textContent='🚧 施工开始！';
                status.classList.add('ok');
              });
            }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        if (!doc) {
          const m = code.match(/<button[^>]*>([\s\S]*?)<\/button>/i);
          if (!m) return { passed: false, message: '没有 <button> 按钮。写 <button>文字</button>' };
          if (!m[1].trim()) return { passed: false, message: '按钮上是空的，写点文字，如"启动施工"。' };
          return { passed: true, message: '启动按钮就位！' };
        }
        const btn = doc.querySelector('button');
        if (!btn) return { passed: false, message: '没有 <button> 按钮。写 <button>文字</button>' };
        if (!btn.textContent.trim()) return { passed: false, message: '按钮上是空的，写点文字，如"启动施工"。' };
        return { passed: true, message: '启动按钮就位！' };
      }
    },
    {
      id: 'html-10', langId: 'html', index: 10,
      title: '综合建造', subtitle: 'Final Build',
      narrative: '毕业考验来了！在空白工地上，综合使用 h1、p、img、a、button 搭建一个完整的小网页。目标：包含至少 4 种标签。',
      knowledge: [
        '一个完整网页 = 多种标签的组合（标题 + 段落 + 图片 + 链接 + 按钮）',
        'h1 立标题，p 写描述，img 放图片，a 做链接，button 做按钮',
        'HTML 是网页的骨架，组合标签就能搭出完整页面'
      ],
      starterCode: '<!-- 海狸：搭建你的第一个迷你网页！\n     至少使用 4 种标签：h1 / p / img / a / button -->\n',
      solution: '<h1>我的小屋</h1><p>这是我的第一个网页</p><img src="https://picsum.photos/300/200"><a href="#">去看看</a><button>开始</button>',
      hint: '至少写 4 种标签。例如：<h1>标题</h1> + <p>描述</p> + <img src="图片"> + <button>按钮</button>',
      buildPreview: (code) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;box-sizing:border-box}
        body{height:100vh;overflow:hidden;font-family:'Microsoft Yahei',sans-serif;
             background:linear-gradient(180deg,#1a2332 0%,#2a3a52 55%,#3a4a62 100%);color:#fff;position:relative}
        .ground{position:absolute;left:0;right:0;bottom:0;height:34%;
             background:repeating-linear-gradient(90deg,#4a5a6a 0 30px,#3a4a5a 30px 60px);border-top:4px solid #f5a623}
        .scene{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;
             min-height:52%;padding:36px 24px 16px;text-align:center}
        .house{position:absolute;right:8%;bottom:34%;z-index:1;font-size:0;opacity:0;transition:opacity .6s ease}
        .house.show{opacity:1;animation:rise 1s cubic-bezier(.34,1.56,.64,1) both}
        @keyframes rise{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
        .house .roof{width:0;height:0;border-left:60px solid transparent;border-right:60px solid transparent;border-bottom:50px solid #e07b39}
        .house .body{width:120px;height:80px;background:#f5d9a8;display:flex;justify-content:center;align-items:flex-end;padding-bottom:8px}
        .house .door{width:28px;height:40px;background:#8a6d3b;border-radius:4px 4px 0 0}
        .beaver{position:absolute;left:20px;bottom:20px;z-index:5;display:flex;align-items:flex-end;gap:8px}
        .beaver-ico{font-size:52px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4))}
        .beaver-talk{max-width:260px;background:rgba(255,255,255,.95);color:#1a2332;font-size:13px;line-height:1.6;
             padding:10px 14px;border-radius:12px;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.3)}
        .status-msg{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:6;
             background:rgba(26,35,50,.85);border:1px solid rgba(245,166,35,.5);color:#ffd98a;
             font-size:13px;padding:8px 20px;border-radius:999px;letter-spacing:1px}
        .status-msg.ok{background:rgba(0,200,120,.85);border-color:#00c878;color:#fff}
        h1{font-size:30px;color:#f5a623;margin:0 0 10px}
        p{font-size:15px;color:#d8e4f0;margin:0 0 10px;max-width:420px}
        img{max-width:220px;border-radius:8px;border:3px solid #8a6d3b;margin-bottom:10px}
        a{color:#7ec8ff;margin-bottom:10px;display:inline-block}
        button{font-size:15px;font-weight:bold;color:#1a2332;background:#f5a623;border:none;padding:10px 26px;border-radius:8px;cursor:pointer}
        .tag-count{position:absolute;top:64px;left:50%;transform:translateX(-50%);z-index:6;color:#8a9ab0;
           font-size:12px;letter-spacing:1px}
        .tag-count b{color:#ffd98a}
      </style></head><body>
        <div class="ground"></div>
        <div class="status-msg" id="status">空白工地，开始综合建造！</div>
        <div class="tag-count">已用标签：<b id="countNum">0</b> / 4</div>
        <div class="scene">${safeCode(code)}</div>
        <div class="house" id="house"><div class="roof"></div><div class="body"><div class="door"></div></div></div>
        <div class="beaver"><div class="beaver-ico">🦫</div><div class="beaver-talk">综合运用所学！至少 4 种标签，搭出你的第一个网页</div></div>
        <script>
          (function(){
            const tags=['h1','p','img','a','button'];
            const used=tags.filter(t=>document.querySelector(t));
            const num=document.getElementById('countNum');
            const status=document.getElementById('status');
            const house=document.getElementById('house');
            num.textContent=used.length;
            if(used.length>=4){
              status.textContent='🎉 迷你网页搭建完成！';
              status.classList.add('ok');
              house.classList.add('show');
              setTimeout(()=>{ status.textContent='🏠 工地变成了漂亮的小房子！'; }, 900);
            } else if(used.length>0){
              status.textContent='还差 '+(4-used.length)+' 种标签…（已用：'+used.join('、')+'）';
            }
          })();
        </script>
      </body></html>`,
      check: (code, doc) => {
        const tags = ['h1', 'p', 'img', 'a', 'button'];
        let used;
        if (!doc) {
          used = tags.filter(t => new RegExp('<' + t + '[\\s>]', 'i').test(code));
        } else {
          used = tags.filter(t => doc.querySelector(t));
        }
        if (used.length < 4) return { passed: false, message: `用了 ${used.length} 种标签（${used.join('、') || '无'}），需要至少 4 种。` };
        return { passed: true, message: '迷你网页搭建完成，工地变房子了！' };
      }
    }
  ]
};

window.LEVELS = LEVELS;

  // ===== 运行时状态 =====
  const state = {
    currentLang: null, currentLevel: null,
    editorEl: null, iframeEl: null, toastTimer: null,
  };

  const $ = (id) => document.getElementById(id);

  // 从剧情文本中提取「目标：xxx」作为本关目标
  const deriveObjective = (level) => {
    const m = level.narrative.match(/目标[:：]\s*([^。.!?]+)/);
    if (m) return m[1].trim();
    const m2 = level.narrative.match(/任务[:：]\s*([^。.!?]+)/);
    if (m2) return m2[1].trim();
    return '编写代码，完成本关挑战';
  };

  // ===== 核心 API =====
  const Runtime = {
    showLevel(langId, index) {
      const lang = window.LANGUAGES.find(l => l.id === langId);
      const levels = LEVELS[langId];
      if (!lang || !levels || !levels[index - 1]) {
        window.app && window.app.navigateTo('#');
        return;
      }
      const level = levels[index - 1];
      state.currentLang = lang;
      state.currentLevel = level;

      // 切换 page
      document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
      const lp = $('levelPage');
      lp.style.display = 'flex';
      lp.classList.add('active');

      // 主题色注入
      lp.style.setProperty('--card-color-1', lang.color1);
      lp.style.setProperty('--card-color-2', lang.color2);
      lp.style.setProperty('--card-glow', lang.glow);

      // 填充内容
      $('levelIcon').textContent = lang.icon;
      $('levelTitle').textContent = level.title;
      $('levelSubtitle').textContent = `${lang.name} · ${lang.gameplay} · 第 ${index} 关`;
      $('levelProgress').textContent = `${index} / ${lang.levels}`;
      $('hintText').textContent = level.hint;

      // 任务目标（显示在顶部目标横幅）
      const objEl = $('missionObjective');
      if (objEl) objEl.textContent = deriveObjective(level);

      // 复位过关结算与挑战次数
      state.attempts = 0;
      const pm = $('passModal');
      if (pm) pm.hidden = true;
      const starWrap = $('starRating');
      if (starWrap) {
        starWrap.querySelectorAll('.star').forEach(s => {
          s.classList.remove('filled');
          s.classList.add('empty');
          s.style.animationDelay = '0s';
        });
      }

      // 编辑器始终恢复为该关骨架起始代码，禁止残留上次代码或答案
      state.editorEl.value = level.starterCode;

      // 标记当前屏为 level（避免 picker 键盘拦截）
      if (window.app) window.app.currentScreen = 'level';

      // 自动运行预览
      this.runPreview();
    },

    runPreview() {
      const level = state.currentLevel;
      if (!level || !state.iframeEl) return;
      const code = state.editorEl.value;
      const status = $('previewStatus');
      status.textContent = '运行中'; status.className = 'preview-status running';
      try {
        state.iframeEl.srcdoc = level.buildPreview(code);
      } catch (e) {
        status.textContent = '错误'; status.className = 'preview-status error';
        return;
      }
      state.iframeEl.onload = () => {
        status.textContent = '就绪'; status.className = 'preview-status';
      };
      setTimeout(() => {
        if (status.classList.contains('running')) {
          status.textContent = '就绪'; status.className = 'preview-status';
        }
      }, 1200);
    },

    async checkAnswer() {
      const level = state.currentLevel;
      if (!level) return;
      const code = state.editorEl.value;
      let result;
      try {
        let doc = null, win = null;
        try { doc = state.iframeEl.contentDocument; win = state.iframeEl.contentWindow; } catch (e) {}
        result = level.check(code, doc, win);
        if (!result.passed && level.asyncRecheck) {
          await new Promise(r => setTimeout(r, 700));
          try { doc = state.iframeEl.contentDocument; win = state.iframeEl.contentWindow; } catch (e) {}
          result = level.check(code, doc, win);
        }
      } catch (e) {
        result = { passed: false, message: '检查出错：' + e.message };
      }
      if (result.passed) {
        this.markComplete(level);
        this.celebrate();
        const stars = this.computeStars();
        this.showPassModal(level, stars);
      } else {
        state.attempts = (state.attempts || 0) + 1;
        this.showToast('error', '再试试：' + result.message);
      }
    },

    markComplete(level) {
      const key = `progress_${level.langId}`;
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      data.completed = Math.max(data.completed || 0, level.index);
      data.levels = data.levels || [];
      if (!data.levels.includes(level.index)) data.levels.push(level.index);
      localStorage.setItem(key, JSON.stringify(data));
    },

    showHint() {
      $('hintModal').hidden = false;
    },

    resetCode() {
      if (!state.currentLevel) return;
      state.editorEl.value = state.currentLevel.starterCode;
      this.runPreview();
      this.showToast('success', '代码已重置');
    },

    showToast(type, msg) {
      const toast = $('levelToast');
      toast.textContent = msg;
      toast.className = 'level-toast ' + type;
      toast.hidden = false;
      requestAnimationFrame(() => toast.classList.add('show'));
      clearTimeout(state.toastTimer);
      state.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.hidden = true; }, 400);
      }, 2600);
    },

    // 通关庆祝：战场实况区域粒子爆发
    celebrate() {
      if (window.app && window.app.spawnClickEffect) {
        const r = state.iframeEl.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            window.app.spawnClickEffect(
              cx + (Math.random() - 0.5) * 220,
              cy + (Math.random() - 0.5) * 170,
              state.currentLang.color1,
              true
            );
          }, i * 120);
        }
      }
    },

    // 星级评价：按「未提交错误尝试」次数评定
    computeStars() {
      const a = state.attempts || 0;
      if (a === 0) return 3;
      if (a <= 2) return 2;
      return 1;
    },

    // 过关结算弹窗：星级 + 奖励反馈
    showPassModal(level, stars) {
      const starWrap = $('starRating');
      if (starWrap) {
        starWrap.querySelectorAll('.star').forEach((s, i) => {
          if (i < stars) {
            s.classList.add('filled');
            s.classList.remove('empty');
            s.style.animationDelay = (i * 0.18) + 's';
          } else {
            s.classList.remove('filled');
            s.classList.add('empty');
            s.style.animationDelay = '0s';
          }
        });
      }
      const exp = 50 + stars * 25;
      const coin = 20 + stars * 15;
      const re = $('rewardExp'); if (re) re.textContent = '+' + exp;
      const rc = $('rewardCoin'); if (rc) rc.textContent = '+' + coin;
      const pm = $('passModal'); if (pm) pm.hidden = false;
    },

    // Portal 过渡：从卡片位置扩展主题色色块到全屏
    startPortalTransition(rect, lang) {
      const overlay = document.createElement('div');
      overlay.className = 'portal-overlay';
      overlay.style.top = rect.top + 'px';
      overlay.style.left = rect.left + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
      overlay.style.setProperty('--card-color-1', lang.color1);
      overlay.style.setProperty('--card-color-2', lang.color2);
      overlay.style.setProperty('--card-glow', lang.glow);
      document.body.appendChild(overlay);
      overlay.offsetHeight; // 强制 reflow
      overlay.classList.add('expanding');
      setTimeout(() => overlay.classList.add('fading'), 560);
      setTimeout(() => overlay.remove(), 950);
    },
  };

  window.LevelsRuntime = Runtime;

  // ===== 事件绑定 =====
  document.addEventListener('DOMContentLoaded', () => {
    state.editorEl = $('codeEditor');
    state.iframeEl = $('previewFrame');
    if (!state.editorEl || !state.iframeEl) return;

    $('btnCheck').addEventListener('click', () => Runtime.checkAnswer());
    $('btnHint').addEventListener('click', () => Runtime.showHint());
    $('hintClose').addEventListener('click', () => { $('hintModal').hidden = true; });
    $('levelBackBtn').addEventListener('click', () => {
      if (window.app) window.app.navigateTo('#');
    });

    // 过关结算：继续冒险 / 返回地图
    $('passNextBtn').addEventListener('click', () => {
      $('passModal').hidden = true;
      const cur = state.currentLevel;
      const next = cur && LEVELS[state.currentLang.id][cur.index];
      if (next) {
        Runtime.showLevel(state.currentLang.id, cur.index + 1);
      } else if (window.app) {
        window.app.navigateTo('#');
      }
    });
    $('passBackBtn').addEventListener('click', () => {
      $('passModal').hidden = true;
      if (window.app) window.app.navigateTo('#');
    });

    // 编辑器实时预览（debounce）
    let t;
    state.editorEl.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => Runtime.runPreview(), 500);
    });
    // Ctrl/Cmd+Enter 检查答案
    state.editorEl.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        Runtime.checkAnswer();
      }
      e.stopPropagation(); // 阻止全局 picker 键盘拦截
    });
  });
})();
