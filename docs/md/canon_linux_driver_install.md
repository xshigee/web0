
2023/9/5+  
初版  

# Canonプリンター/スキャナー(複合機 TS8630)のドライバーのインストール方法(linux版)

## 概要
linuxのドライバーのインストールが分かりにくかったので纏めた。


## 1.プリンタードライバー
[https://canon.jp/support/software/os?pr=5582](https://canon.jp/support/software/os?pr=5582)  
[IJ Printer Driver Ver. 6.50 (debianパッケージアーカイブ)](https://pdisp01.c-wss.com/gdl/WWUFORedirectTarget.do?id=MDEwMDAxMTYzNzAx&cmp=ACM&lang=JA)  

インストール方法    
上のurlからダウンロードしたものを解凍して以下を実行する：
```bash

#解凍したディレクトリに入る：
sudo ./install.sh
```

## 2.スキャナードライバー
[https://canon.jp/support/software/os/select/ij-mfp/scangearmp2-450-1-debtar?pr=5582&os=20](https://canon.jp/support/software/os/select/ij-mfp/scangearmp2-450-1-debtar?pr=5582&os=20)  
ScanGear MP Ver. 4.50 (debianパッケージアーカイブ)

インストール方法  
上のurlからダウンロードしたものを解凍して以下を実行する：  
```bash

sudp apt update
sudo apt install libpango1.0-0
sudo apt install xsane
sudo apt install sane-utils
#解凍したディレクトリに入る：
sudo ./install.sh
```

なお、スキャナーアプリとしては、xsaneになる。  

GIMPでプラグインで直にスキャナーで読めるらしいが  
自分の環境では上手く行かなかった。  
もっとも、xsaneで読んでファイル経由でGIMPに取り込めるので、特に問題はない。  
  


以上
