    
# WSL2にUSBデバイスを接続する   

2022/8/19     
初版    
  
## 概要  
WSL2では直接アクセスする形でのUSBデバイス(ストレージを除く)はサポートされていないがwindow側で接続したUSBデバイスをIP(TCP)経由でWSL2に接続できる。  
ここでは、その方法について述べる。  
なお、kernelのバージョンの依存性があるので、ここでは、ubuntu2204(WSL2)を使用することとする。

## 1.USBIPD-WINのインストール(windows側)

以下をダウンロートしてインストールする：   
https://github.com/dorssel/usbipd-win/releases/download/v2.3.0/usbipd-win_2.3.0.msi

## 2.USBIPツールのインストール(WSL2側)                                           
WSL2(ubuntu2204)で以下を実行する：                                          

```bash

sudo apt install linux-tools-5.15.0-25-generic hwdata
sudo update-alternatives --install /usr/local/bin/usbip usbip /usr/lib/linux-tools/5.15.0-25-generic/usbip 20

```
## 3.USB デバイスを接続する

1.WSL2でアクセスしたいUSBデバイスを接続する。                     

2.PowerShellを 管理者モードで開き以下を実行する。  
(Windows に接続されたすべての USB デバイスの一覧を表示する)   
```powershell

usbipd wsl list
BUSID  VID:PID    DEVICE                                                        STATE
1-1    0403:6001  USB Serial Converter                                          Not attached
1-6    1199:9079  Sierra Wireless EM7455 Qualcomm Snapdragon X7 LTE-A           Not attached
1-7    8087:0a2b  インテル(R) ワイヤレス Bluetooth(R)                           Not attached
1-8    13d3:5682  Integrated Camera                                             Not attached
1-9    138a:0097  Synaptics WBDI - SGX po                                       Not attached

```       
3.windowsのファイアウォールを外す。
必要なポートだけ通すのが正しいが、ここでは、簡易的にファイアウォールを無効にする。

4.WSL2にアタッチしたいデバイスのBUSIDを指定する。  
```powershell

usbipd wsl attach --busid 1-1


```   
この例では、1-1(USB Serial Converter)を指定している。

注意：  
想定しているディストリビューションと異なるとエラーになるので、その場合は以下を実行してデフォルトのディストリビューションをubuntu2204にする。
```powershell

wsl --list
Linux 用 Windows サブシステム ディストリビューション:
Ubuntu-20.04 (既定)
Ubuntu-22.04

wsl --setdefault Ubuntu-22.04

wsl --list
Linux 用 Windows サブシステム ディストリビューション:
Ubuntu-22.04 (既定)
Ubuntu-20.04
```
## 4.WSL2側のUSB状況
WSL2側で以下を実行するとWSL2のUSBの接続状況が分かる：  

```bash

lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 002: ID 0403:6001 Future Technology Devices International, Ltd FT232 Serial (UART) IC
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub

ls /dev/ttyU*
/dev/ttyUSB0  
# /dev/ttyUSB0 がWSL2に接続されていることが分かる。

```
接続していたUSBシリアルを抜いた後の再接続の際に以下を実行する(powershell側)：   
```
usbipd wsl attach --busid 1-1
```
## 新しいユーザー登録
新しくインストールしたディストリビューションを起動するとrootのみの場合があったので、その場合、以下の手順で新しいユーザーを登録する：   
```

adduser USER
# 以下のように色々聞いてくるのでパスワードなどを入力する
# (USERは新しいユーザー名とする)
New password:
Retype new password:
passwd: password updated successfully
Changing the user information for test_user
Enter the new value, or press ENTER for the default
        Full Name []:
        Room Number []:
        Work Phone []:
        Home Phone []:
        Other []:
Is the information correct? [Y/n]

usermod -G sudo USER
# sudoユーザーに登録する

```

## ログインするデフォルトユーザーの変更 
powershellで以下を実行する：  
```powershell

ubuntu2204 config --default-user USER

```
                                               
## rootユーザーでログイン
powershellで以下を実行する：  
```powershell

wsl -u root

```

## 参考情報   

[USB デバイスを接続する](https://docs.microsoft.com/ja-jp/windows/wsl/connect-usb)  
[WSL2の初歩メモ](https://qiita.com/rubytomato@github/items/a290ecef2ea86ea8350f)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

