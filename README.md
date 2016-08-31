# Cyclical reference

The idea comes from [this StackExchange question](http://ethereum.stackexchange.com/questions/8442/avoiding-ownership-cycles-in-contracts/).

Contract addresses are calculated with the sender and the transaction nonce. More [here](http://martin.swende.se/blog/Ethereum_quirks_and_vulns.html). So it is possible to know what address your contract will be deployed at. This can become useful if you want to pass one future contract's address in the constructor of another.

Here we have `Left` and `Right` contracts:

* `Left` is constructed with `Right`'s address
* `Right` is constructed with `Left`'s address