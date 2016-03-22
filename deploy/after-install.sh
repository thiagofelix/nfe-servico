echo "Installing Node...";
curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
yum -y install nodejs

echo "Installing application...";
cd /srv/src/
npm install

echo "Building application...";
npm run build
