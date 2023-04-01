    
# WSL2にQuilをインストールする  

2023/4/2        
初版    
  
## 概要  
QuilはClojureで動作する[processing](https://processing.org/)ライクなプログラミング環境である。  
clojureが動作する環境であればQuilは動作するが、  
ここではWSL2で動作させる手順などについて記述する。  

## clojure/leiningenのインストール
clojureとclojureのビルドツールであるleiningenをインストールする。

WSL2で以下を実行する：  
```bash

sudo apt install clojure

# clojure(省略形clj)のバージョンの確認
clj --version
Clojure CLI version 1.11.1.1252

sudo apt install leiningen

# leiningen(省略形lein)のバージョンの確認
lein --version
Leiningen 2.9.1 on Java 11.0.18 OpenJDK 64-Bit Server VM

```

## Quilのインストールと実行

以下の手順を実行する：  
```bash

# quilがテンプレートにあるので、それを利用する
# p5は任意のプロジェクト名(ただし大文字はNG)
lein new quil p5
Generating fresh 'lein new' quil project.

cd p5
# 以下のようにエントリーポイント(main)が設定されてないエラーが出る
lein run
No :main namespace specified in project.clj.

# それを解消するためにproject.cljを修正する
code project.clj 
#<------------------
以下を追加する：
  :main xxxx.core
  :aot [xxxx.core]
XXXXは「(defproject p5 」の名前に合わせる。
この場合、xxxxはp5になる。
#>------------------

# 「lein run」が何故かエラーになるので「lein repl」を使用する
# (「lein run」だと実行するが直ぐにタイムアウトしているように見える)
lein repl
Compiling p5.core
nREPL server started on port 38059 on host 127.0.0.1 - nrepl://127.0.0.1:38059
REPL-y 0.4.3, nREPL 0.6.0
Clojure 1.10.1
OpenJDK 64-Bit Server VM 11.0.18+10-post-Ubuntu-0ubuntu122.04
    Docs: (doc function-name-here)
          (find-doc "part-of-name-here")
  Source: (source function-name-here)
 Javadoc: (javadoc java-object-or-class-here)
    Exit: Control+D or (exit) or (quit)
 Results: Stored in vars *1, *2, *3, an exception in *e

p5.core=> 

# テンプレートとして組み込まれているプログラムが実行される。
# 抜けるときは、[Ctrl]+[D]を押す。
```

## 修正したproject.clj(参考例)
```clj

(defproject p5 "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.10.1"]
                 [quil "3.1.0"]]
                 
  :main p5.core
  :aot [p5.core]

) 
```

任意のプログラムを実行する場合、src/p5/core.cljを編集する。

## 任意のプログラム例
src/p5/core.clj
```clj
(ns p5.core
  (:require [quil.core :as q]
            [quil.middleware :as m]))

;---------------------------------------

(defn setup []
  (q/frame-rate 60)                    ;; Set framerate to 1 FPS
  (q/background 200))                 ;; Set the background colour to
                                      ;; a nice shade of grey.
(defn draw []
  (q/stroke (q/random 255))             ;; Set the stroke colour to a random grey
  (q/stroke-weight (q/random 10))       ;; Set the stroke thickness randomly
  (q/fill (q/random 255)(q/random 255)(q/random 255))               ;; Set the fill colour to a random grey

  (let [diam (q/random 100)             ;; Set the diameter to a value between 0 and 100
        x    (q/random (q/width))       ;; Set the x coord randomly within the sketch
        y    (q/random (q/height))]     ;; Set the y coord randomly within the sketch
    (q/ellipse x y diam diam)))         ;; Draw a circle at x y with the correct diameter

(q/defsketch example                  ;; Define a new sketch named example
  :title "Oh so many color circles"    ;; Set the title of the sketch
  :settings #(q/smooth 2)             ;; Turn on anti-aliasing
  :setup setup                        ;; Specify the setup fn
  :draw draw                          ;; Specify the draw fn
  :size [640 320])                    ;; You struggle to beat the golden ratio

```
・「(ns p5.core ...」の部分はテンプレートのものをそのまま残すこと。   
・ネットにあったプログラムの流用(修正)しているのでコメントは実情と一致していない。  


## 参考情報 
Quil関連：  
[Quil](https://github.com/quil/quil)  
[cheat-sheet.pdf](https://github.com/quil/quil/blob/master/docs/cheatsheet/cheat-sheet.pdf)  
[Examples of different quil sketches](https://github.com/quil/quil-examples)  
[Quil Intro](http://nbeloglazov.com/2014/05/29/quil-intro.html)  
[Generative Art - Quil Translations](https://github.com/quil/quil-examples/blob/master/src/quil_sketches/gen_art/README.md)  

Clojure関連：  
[The Clojure Programming Language](https://clojure.org/)  
[Leiningen - for automating Clojure projects](https://leiningen.org/)  
[tutorial - leiningen-core 2.9.8](https://cljdoc.org/d/leiningen-core/leiningen-core/2.9.8/doc/tutorial)         
[Leiningen を使って Clojure を書いてみる](https://neos21.net/blog/2022/09/29-01.html)  
[おいしいClojure入門](https://gihyo.jp/book/2013/978-4-7741-5991-1)  

<!--
FoxDot関連：  
[Pythonで始めるアルゴレイヴ入門](https://www.techscore.com/blog/2019/12/22/algorave-python/)  
[FoxDot - Live Coding with Python v0.8](https://github.com/Qirky/FoxDot)  
[FoxDot（音楽用ライブコーディング環境）をインストール](https://qiita.com/Hulc_0418/items/ba3e94633e465f7201d0)  
[Python＆SuperColliderで奏でる音楽ライブコーディング環境「FoxDot」をセットアップ（インストール）する方法！](https://blog.creative-plus.net/archives/8633)  
[FoxDotの「超基礎」第一弾！「テンポ設定＆サンプルを鳴らす＆シンセを鳴らす」で遊び始めろ！](https://blog.creative-plus.net/archives/8663)  
[Pythonでライブコーディングできると聞いて、FoxDotを触ってみた](https://blog.mtb-production.info/entry/2019/09/17/151840)  

SuperCollider関連：   
[SuperCollider](https://supercollider.github.io/)  
[Designing Sound in SuperCollider](https://en.wikibooks.org/wiki/Designing_Sound_in_SuperCollider)  
[オープンソースの音響プログラミング言語「SuperCollider」の紹介](https://tracpath.com/works/devops/supercollider/)  
[SuperCollider自主練 - 基本編](https://yoppa.org/works/ofbook_study/ofbook_study01.html)  
-->

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

