# Generating Load on a Container
```
kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- https://api.company.com/contacts/contacts; done"
```