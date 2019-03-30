# fs-maybe-open

**Open a file unless it's already a file descriptor.**

[![npm status](http://img.shields.io/npm/v/fs-maybe-open.svg?style=flat-square)](https://www.npmjs.org/package/fs-maybe-open) [![node](https://img.shields.io/node/v/fs-maybe-open.svg?style=flat-square)](https://www.npmjs.org/package/fs-maybe-open) [![Travis build status](https://img.shields.io/travis/vweevers/fs-maybe-open.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/fs-maybe-open) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/fs-maybe-open.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/fs-maybe-open) [![Dependency status](https://img.shields.io/david/vweevers/fs-maybe-open.svg?style=flat-square)](https://david-dm.org/vweevers/fs-maybe-open) [![Greenkeeper badge](https://badges.greenkeeper.io/vweevers/fs-maybe-open.svg)](https://greenkeeper.io/)

## usage

```js
const maybeOpen = require('fs-maybe-open')
    , fs = require('fs')

function readExactly(fdOrFile, pos, length, done) {
  maybeOpen(fdOrFile, 'r', function (err, fd, maybeClose) {
    if (err) return done(err)

    fs.read(fd, Buffer(length), 0, length, pos, function (err, bytesRead, buf) {
      if (err) return maybeClose(done, err)

      if (bytesRead !== length) {
        return maybeClose(done, new Error('End of file'))
      }

      maybeClose(done, null, buf)
    })
  })
}
```

The `maybeOpen` function has the same signature as [`fs.open(path, flags[, mode], callback)`](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback). Except:

- If `path` is a file descriptor, opening is a noop
- The open `callback` also receives a `maybeClose(callback, err, ...args)` function, which calls `fs.close` for you if `path` was a filename. An error from `fs.close` (if any) will be [combined](https://github.com/matthewmueller/combine-errors) with your error (if any).

## install

With [npm](https://npmjs.org) do:

```
npm install fs-maybe-open
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
