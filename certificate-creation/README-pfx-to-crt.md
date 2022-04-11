# Convert PFX to CRT & KEY

If you have a PFX file and need to convert it to CRT & KEY files for use with Kubernetes, use the following steps

## Extract the CRT from the PFX

```
openssl pkcs12 -in <yourfilename.pfx> -clcerts -nokeys -out <yourfilename.crt>
```

## Extract the Encrypted KEY from the PFX

```
openssl pkcs12 -in <yourfilename.pfx> -nocerts -out <yourfilename-encrypted.key>
```

## Extract the Decrypted KEY from the Encrypted KEY

```
openssl rsa -in <yourfilename-encrypted.key> -out <yourfilename-decrypted.key>
```

## Add Certificate to Kubernetes

```
kubectl create secret tls <secret-name> --cert <yourfilename.crt> --key <yourfilename-decrypted.key>
```