# MacOS X Certificate Creation Steps

This demo uses a self-signed certificate along with modifying the ;local computer's `hosts` file to point that domain name to `localhost`.  For production, you would instead use real certificates and DNS name resolution, modifying the YAML files as appropriate. 

1) From within this folder, execute the following commands to create a certificate for the local demo

```
sudo openssl genrsa -des3 -out rootCA.key 2048
sudo openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem

openssl req -new -sha256 -nodes -out local.com.csr -newkey rsa:2048 -keyout local.com.key -config <( cat local.com.csr.cnf )
sudo openssl x509 -req -in local.com.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out local.com.crt -days 500 -sha256 -extfile local.com.v3.ext
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain company.com.crt
```

2) If also doing the aks demo run the following additional commands

```
openssl req -new -sha256 -nodes -out company.com.csr -newkey rsa:2048 -keyout company.com.key -config <( cat company.com.csr.cnf )
sudo openssl x509 -req -in company.com.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out company.com.crt -days 500 -sha256 -extfile company.com.v3.ext
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain local.com.crt
```

Example values:
* Country Name = US
* State or Provice Name = Michigan
* Locality Name = Detroit
* Organization Name = Local, LLC
* Organization Unit Name = Tech
* Common Name = www.company.com
* Email Address paul.gilchrist@outlook.com


3) Open Keychain Access and trust the new certificate (local.com for local-demo, and company.com for aks-demo)

4) Add one of the following certificates to an K8s secret (choose based on current kubernetes context)

```
kubectl create secret tls domain-cert --key local.com.key --cert local.com.crt -n demo
kubectl create secret tls domain-cert --key company.com.key --cert company.com.crt -n demo
```