    
# RaspberryPiをEnviroをインストールする  

2023/10/12  
初版    
  
## 概要
RaspberryPiを以下のEnviroをインストールする。  

[Enviro - Raspberry Pi用環境センサボード](https://www.switch-science.com/products/6396)  

「40ピンヘッダRaspberry Pi 全モデルに適合」なので、Zeroでも動作可能と思うが、今回はRaspberryPi4で動かした。  

センサーを追加した新しいバージョンのボードもある：  
[Enviro for Raspberry Pi – Enviro + Air Quality](https://shop.pimoroni.com/products/enviro?variant=31155658457171)  

## インストール方法

以下でインストールする：  
```
cd ~/Downloads
git clone https://github.com/pimoroni/enviroplus-python
cd enviroplus-python
sudo ./install.sh

#インストール直後はrebootする
sudo reboot
```

以下でサンプルを動作する：  
```
cd ~/Downloads/enviroplus-python/examples
#以下でボード上のLCDにセンサー値を表示する
python all-in-one-enviro-mini.py

python weather-and-light.py

python lcd.py

#センサー値をコンソールに出力する
python weather.py
2023-10-10 21:06:56.122 INFO     Temperature: 36.16 *C
Pressure: 1011.56 hPa
Relative humidity: 38.77 %

```

以下を実行するとログアウトしてもプログラムが継続する
```
nohup python weather-and-light.py &

```

止める場合は再度ログインして以下を実行する：
```
#以下を実行して実行中のプロセスIDを確認する
ps -ef | grep python
#表示された結果のうち、左から二列目がプロセスIDになる

#止めたいプロセスID(xxxx)を確認したら、kill コマンドで強制終了する。
kill -9 xxxx

```

参考：
[Enviro for Raspberry Pi - Enviro](https://shop.pimoroni.com/products/enviro?variant=31155658489939)   
[Getting Started with Enviro+](https://learn.pimoroni.com/article/getting-started-with-enviro-plus)   
[nohup 付きで実行した処理を強制終了したい](https://ja.stackoverflow.com/questions/72807/nohup-%E4%BB%98%E3%81%8D%E3%81%A7%E5%AE%9F%E8%A1%8C%E3%81%97%E3%81%9F%E5%87%A6%E7%90%86%E3%82%92%E5%BC%B7%E5%88%B6%E7%B5%82%E4%BA%86%E3%81%97%E3%81%9F%E3%81%84)   

[Go to Toplevel](https://xshigee.github.io/web0/)  

