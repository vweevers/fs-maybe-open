'use strict';

const open = require('fs-lotus')
    , dezalgo = process.nextTick

module.exports = function maybeOpen (mixed, flags, mode, done) {
  if (typeof mode === 'function') {
    done = mode, mode = undefined
  }

  if (typeof mixed === 'string') {
    open(mixed, flags, mode, done)
  } else if (typeof mixed === 'number') {
    dezalgo(done, null, mixed, dezalgo)
  } else {
    done(new TypeError('Expected a file descriptor or filename'))
  }
}
