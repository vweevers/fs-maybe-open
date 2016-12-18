'use strict';

const test = require('tape')
    , fs = require('fs')
    , maybeOpen = require('.')

test('fd', function (t) {
  t.plan(9)

  fs.open(__filename, 'r', function (err, fd) {
    t.ifError(err, 'no open error')

    let maybeOpenSync = true

    maybeOpen(fd, 'r', function (err, fd2, maybeClose) {
      t.ifError(err, 'no maybeOpen error')
      t.ok(fd === fd2, 'same fd')
      t.is(maybeOpenSync, false, 'maybeOpen is async')

      let maybeCloseSync = true

      maybeClose(function (err, arg1, arg2) {
        t.ifError(err, 'no maybeClose error')
        t.is(maybeCloseSync, false, 'maybeClose is async')
        t.is(arg1, 'arg1', 'received arg1')
        t.is(arg2, 'arg2', 'received arg2')

        // Assert fd is not closed
        fs.close(fd2, function (err) {
          t.ifError(err, 'no close error')
        })
      }, null, 'arg1', 'arg2')

      maybeCloseSync = false
    })

    maybeOpenSync = false
  })
})

test('file', function (t) {
  t.plan(7)

  maybeOpen(__filename, 'r', function (err, fd, maybeClose) {
    t.ifError(err, 'no maybeOpen error')

    fs.read(fd, Buffer(12), 0, 12, 0, function (err, bytesRead, buf) {
      t.ifError(err, 'no read error')
      t.is(String(buf), "'use strict'")

      maybeClose(function (err, arg1, arg2) {
        t.ifError(err, 'no maybeClose error')
        t.is(arg1, 'arg1', 'received arg1')
        t.is(arg2, 'arg2', 'received arg2')

        fs.close(fd, function (err) {
          t.is(err && err.code, 'EBADF', 'already closed')
        })
      }, null, 'arg1', 'arg2')
    })
  })
})

test('file close after user error', function (t) {
  t.plan(4)

  maybeOpen(__filename, 'r', function (err, fd, maybeClose) {
    t.ifError(err, 'no maybeOpen error')

    maybeClose(function (err, arg1) {
      t.is(err && err.message, 'test', 'got error')
      t.is(arg1, undefined, 'no other arguments')

      fs.close(fd, function (err) {
        t.is(err && err.code, 'EBADF', 'already closed')
      })
    }, new Error('test'), 'ignored')
  })
})

test('invalid argument', function (t) {
  t.plan(1)

  maybeOpen(true, 'r', function (err) {
    t.is(err && err.message, 'Expected a file descriptor or filename')
  })
})
