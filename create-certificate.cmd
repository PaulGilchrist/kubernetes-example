https://www.endpoint.com/blog/2014/10/30/openssl-csr-with-alternative-names-one

openssl req -new -sha256 -nodes -out company.com.cert -newkey rsa:2048 -keyout company.com.key -config <(


openssl req -x509 -nodes -days 365 -newkey rsa:2048 -out company.com.cert -keyout company.com.key -config <(
cat <<-EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[ dn ]
C=US
ST=Michigan
L=Flint
O=Demo Company
OU=Testing Domain
emailAddress=paul.gilchrist@outlook.com
CN = company.com

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = company.com
DNS.2 = *.company.com
DNS.3 = contacts.company.com
DNS.4 = products.company.com
EOF
)