    
# zoteroでURLブックマークを作る  

2023/11/11  
初版    
  
## 概要
引用管理ソフトウェアであるZoteroというソフトウェアを利用してURLブックマークを作る。

参照：   
・[Zotero WiKi](https://ja.wikipedia.org/wiki/Zotero)  
・[無料で論文をシンプルに管理できて引用文献リスト作成もワンクリックな高性能文献管理ソフト「Zotero」レビュー](https://gigazine.net/news/20220108-zotero/)  


## インストール方法
以下の手順に従ってインストールする：  
[https://www.zotero.org/download/](https://www.zotero.org/download/)  
\# 今回の場合はアカウントを作る必要はない


## 新規translatorのインストール
以下をjsファイルを以下のディレクトリに置く：  
C:\\Users\\USERID\\Zotero\\translators
\# USERIDは使用しているPCのものに変更すること
\# 上のディレクトリはwindowsの場合である
他のOSの場合、[The Zotero Data Directory](https://www.zotero.org/support/zotero_data)のDefault_Locationsを参照のこと

url2md.js
```javascript
{
    "translatorID":"dd6be42a-49d3-dfca-f6db-62d3bfc99e48",
    "translatorType":2,
    "label":"URLs to Markdown",
    "creator":"Shigeki KOMATSU",
    "target":"md",
    "minVersion":"2.0",
    "maxVersion":"",
    "priority":200,
    "inRepository":false,
    "lastUpdated":"2023-11-11 11:11:11"
}
     
function doExport() {
    var item;
    while(item = Zotero.nextItem()) {
        // make title short
        Zotero.write("["+item.title.substr(0, 32) + "]");
        // make effective if you want long title
        //Zotero.write("["+item.title + "]");
        Zotero.write("("+item.url + ")  \n");}
}    
```
このtranslatorを有効にするためにZoteroを再起動すること。

## URLブックマークを作る
1. Zoteroを起動する。
1. [My Library]の下に任意のコレクションを作る。(ここではyoutubeとする)
1. ブラウザを立ち上げて、ブックマークしたいurlをポイントして、上で作ったコレクションをドラッグ＆ドロップする。
1. するとコレクションの下にドラッグ＆ドロップしたurlが保存される。
1. 上の手続きを繰り返してurlのコレクションを作る。

## URLブックマークの利用方法
1. Zoteroを起動する。
1. [My Library]の下のコレクションのタイトルをポイントして右クリックで「View Online」を選択するとブラウザが起動して指定したURLの内容が表示される。

## URLブックマークのエクスポート
1. エクスポートしたいコレクションをポイントして右クリックで「Export Collection...」を選択する。
1. Formatで「URLs to Markdown」を選ぶ。
1. 出力ファイル「youtube.md」を選び出力する。(出力名は任意)

これで以下のような出力ファイルができる：  
youtube.md  
```markdown
[TVアニメ「鬼滅の刃」柱解禁PV - YouTube](https://www.youtube.com/watch?v=ad0fHdQfc_g)  
[【完結編後編】ありがとう進撃の巨人 - YouTube](https://www.youtube.com/watch?v=NQIzbAJMQoY&t=2879s)  
[【葬送のフリーレン】ヒンメルは○○を求めていた？石碑の意味が悲し](https://www.youtube.com/watch?v=u7re-1JDXz0)  
[アニメ『豚のレバーは加熱しろ』ラジオ｜豚のラジオは加熱しろ　#2](https://www.youtube.com/watch?v=7mg95tw_Myc)
<省略>
```
実際の表示(markdownのレンダリング出力)：  
[TVアニメ「鬼滅の刃」柱解禁PV - YouTube](https://www.youtube.com/watch?v=ad0fHdQfc_g)  
[【完結編後編】ありがとう進撃の巨人 - YouTube](https://www.youtube.com/watch?v=NQIzbAJMQoY&t=2879s)  
[【葬送のフリーレン】ヒンメルは○○を求めていた？石碑の意味が悲し](https://www.youtube.com/watch?v=u7re-1JDXz0)  
[アニメ『豚のレバーは加熱しろ』ラジオ｜豚のラジオは加熱しろ　#2](https://www.youtube.com/watch?v=7mg95tw_Myc)


[Go to Toplevel](https://xshigee.github.io/web0/)  

