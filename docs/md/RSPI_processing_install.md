    
# RaspberryPiのprocessingをインストールする  

2023/9/25      
初版    
  
## 概要    
RapberryPi版processingをインストールする。  
ARMのCPUの32bits/64bitsでインストールする内容は異なる。  

## インストール

ARM32bitsの場合:
```

cd ~Downloads
wget https://github.com/processing/processing4/releases/download/processing-1293-4.3/processing-4.3-linux-arm32.tgz
tar -zxvf processing-4.3-linux-arm32.tgz

cd ~/Downloads/processing-4.3
sudo ./install.sh

```


ARM64bitsの場合:
```

cd ~Downloads
wget https://github.com/processing/processing4/releases/download/processing-1293-4.3/processing-4.3-linux-arm64.tgz
tar -zxvf processing-4.3-linux-arm64.tgz

cd ~/Downloads/processing-4.3
sudo ./install.sh

```

インストール後、processingのアイコンがメニューに登録される。


## 参照情報  
[Welcome to Processing!](https://processing.org/)  
[https://processing.org/download](https://processing.org/download)  


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

