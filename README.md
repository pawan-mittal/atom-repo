# atom-repo

This package enables simple support for repo (https://github.com/Adobe-Marketing-Cloud/tools/tree/master/repo) in Atom.

Supported operations:
 * Get - uses `repo get` to fetch selected file or folder from AEM
 * Put - uses `repo put` to upload selected file to AEM
 
 Enabling synchronization in REPO menu runs `repo put` whenever file is saved.
 
### Installation

Make sure repo is installed, then follow these steps to install atom-repo package:

```sh
cd ~/.atom/packages
git clone https://github.com/pawan-mittal/atom-repo.git
cd atom-repo
npm install
```
