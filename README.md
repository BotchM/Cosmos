<h1 align="center">Cosmos</h1>

I am writing a script `install` that will automate this process but not ready yet

## Requirements
* Go
* Node 12
  
## Installation

### Windows
* https://nodejs.org/en/download/
* https://dist.ipfs.io/#go-ipfs
* Head to the download website
* Click the latest version and download the .msi file
* Windows sucks so follow this [Ipfs windows tutorial](https://flyingzumwalt.gitbooks.io/decentralized-web-primer/content/install-ipfs/lessons/download-and-install.html) is you get stuck

### Linux

##### IPFS and Golang
```
sudo apt-get update
sudo apt-get install golang-go -y // for later on
wget https://dist.ipfs.io/go-ipfs/v0.4.21/go-ipfs_v0.4.21_linux-386.tar.gz
tar xvfz go-ipfs_v0.4.10_linux-386.tar.gz
sudo mv go-ipfs/ipfs /usr/local/bin/ipfs
```
  
##### Node
```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

##### Yarn
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn
```

## Setup
* Once you have the Requirements
* Go to a terminal and and execute the following
  
```
ipfs init
ipfs daemon
```
```
git clone 'https://botchm:af44e69c2d5dffb25c8b78c8ebc66fa92c131af9@github.com/BotchM/Cosmos.git'
cd Cosmos

npm install
or
yarn install

npn start
or
yarn start
```