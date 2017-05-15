module.exports = {
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  mongo: {
    url: 'mongodb://127.0.0.1/microbackend'
  },
  logger: {
    transport: 'bunyan',
    include: [
      'tracer',
      'timestamp',
      'level',
      'message',
      'error.message',
      'error.code',
      'error.stack',
      'request.url',
      'request.headers',
      'request.params',
      'request.method',
      'response.statusCode',
      'response.headers',
      'response.time',
      'process',
      'system',
      'package.name',
      'service'
    ],
    exclude: [
      'password',
      'secret',
      'token',
      'request.headers.cookie',
      'dependencies',
      'devDependencies'
    ]
  },
  'rabbitmq': {
    'vhosts': {
      '/': {
        'connection': {
          'hostname': '127.0.0.1',
          'user': 'rabbitmq',
          'password': 'rabbitmq'
        },
        'exchanges': [
          'internal',
          'delay',
          'retry',
          'dead_letters'
        ],
        'queues': {
          'service:entity:action': {
            'options': {
              'arguments': {
                'x-dead-letter-exchange': 'dead_letters',
                'x-dead-letter-routing-key': 'service.dead_letter'
              }
            }
          },
          'dead_letters:service': {}
        },
        'bindings': {
          'internal[origin.v1.notifications.entity.past_action] -> service:entity:action': {},
          'retry[service:entity:action.#] -> service:entity:action': {},
          'dead_letters[service.dead_letter] -> dead_letters:service': {}
        },
        'subscriptions': {
          'entity_test': {
            'queue': 'service:entity:action',
            'prefetch': 5
          }
        },
        'publications': {
          'retry_in_5m': {
            'exchange': 'delay',
            'options': {
              'CC': [
                'delay.5m'
              ]
            }
          }
        }
      }
    },
    'recovery': {
      'deferred_retry': [
        {
          'strategy': 'forward',
          'attempts': 10,
          'publication': 'retry_in_5m',
          'xDeathFix': true
        },
        {
          'strategy': 'nack'
        }
      ],
      'dead_letter': [
        {
          'strategy': 'republish',
          'immediateNack': true
        }
      ]
    }
  }
};
