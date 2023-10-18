    
# RP2040_TinyML開発ボードを動かしてみる  

2023/10/18  
初版    
  
## 概要
以下の開発ボードを動かしてみる。  

・[Ａｒｄｕｃａｍ　Ｐｉｃｏ４ＭＬ　ＴｉｎｙＭＬ開発キット（ＲＰ２０４０ボード）　ＱＶＧＡカメラ付　Ｂ０３０２](https://akizukidenshi.com/catalog/g/gM-16714/)  
・[Arducam Pico4ML TinyML開発キット](https://www.switch-science.com/products/8002)  
・[Arducam Pico4ML TinyML Dev Kit](https://www.arducam.com/product/rp2040-based-arducam-pico4ml-dev-board-for-machine-vision/)  

学習済みの動作可能なバイナリがGitHubにあるので、ダウンロードして動かしてみる。
## デモ

以下にあるドラッグ＆ドロップで書き込めるuf2形式のバイナリがあるので書き込んでみる。  
[https://github.com/ArduCAM/pico-tflmicro/tree/main/bin)](https://github.com/ArduCAM/pico-tflmicro/tree/main/bin)

1. Person Detection
バイナリファイル：person_detection_int8.uf2  
カメラに人物を映すと人物である可能性をパーセントで表示する。  
1. Micro Speech
バイナリファイル：micro_speech.uf2  
音声認識で「yes」「no」を認識する。  
1. Magic Wand
バイナリファイル：pico4ml_magic_wand.uf2  
開発ボードにある加速度センサーを利用し、該当ボードを動かしてジェスチャーを認識させる。  

関連情報：  
[pico4ml_user_manual](https://www.arducam.com/downloads/b0302_pico4ml_user_manual.pdf)   
[Pico4ML-board-Shematics](https://www.arducam.com/downloads/Arducam-Pico4ML-board-Shematics-UC-798_SCH.pdf)   
[An RP2040 Based TinyML Dev Board](https://www.arducam.com/pico4ml-an-rp2040-based-platform-for-tiny-machine-learning/)   
[PICO Arducam Examples(pico-tflmicro)](https://github.com/ArduCAM/pico-tflmicro)  
→デモの詳細はここにある。  
<!--
[PICO Arducam Examples(RPI-Pico-Cam)](https://github.com/ArduCAM/RPI-Pico-Cam)   
[]()   
[]()   
[]()   
-->

以上

[Go to Toplevel](https://xshigee.github.io/web0/)  
