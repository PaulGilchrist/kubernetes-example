# MacOS X Certificate Creation Steps

1) From within this folder, execute the following commands

```
sudo openssl genrsa -des3 -out rootCA.key 2048
sudo openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem
openssl req -new -sha256 -nodes -out company.com.csr -newkey rsa:2048 -keyout company.com.key -config <( cat company.com.csr.cnf )
sudo openssl x509 -req -in company.com.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out company.com.crt -days 500 -sha256 -extfile company.com.v3.ext
```

2) Add the new certificate to the operating system

```
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain company.com.crt
```

3) Open Keychain Access and trust the new certificate
4) Add the certificate to a K8s secret

```
kubectl create secret tls company-cert --key company.com.key --cert company.com.crt
```