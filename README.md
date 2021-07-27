# react-concurrent-testing-timers

Explores how to test timer-based actions in React 18.
See ["Planned changes to `act` testing API"](https://github.com/reactwg/react-18/discussions/23#discussioncomment-812450) for more information.

## real timers

It seems like we can't test real timers with `act`.
The updates from real timers are never flushed when wrapped inside `act`.
