import {
  App,
  HttpRequest,
  HttpResponse,
  RecognizedString,
} from 'uWebSockets.js';
import { withResolvers } from './utils/promise';

export type Context = {
  middlewares: Middleware[];
  request: HttpRequest;
  response: HttpResponse;
  req: HttpRequest;
  res: HttpResponse;
  body?: any;
};

export type Next = () => Promise<any>;
export type Middleware = (ctx: Context, next: Next) => any | Promise<any>;

export type Handler = Middleware;

const createApp = () => {
  const uwsApp = App({ passphrase: '1234' });

  const handler = async (
    res: HttpResponse,
    req: HttpRequest,
    middlewares: Middleware[]
  ) => {
    const curCtx: Context = {
      req,
      res,
      request: req,
      response: res,
      body: null,
      middlewares: [...app.middlewares, ...middlewares],
    };

    return dispatch(curCtx);
  };

  const app = {
    uwsApp: uwsApp,
    middlewares: [] as Middleware[],
    use(...middlewares: Middleware[]) {
      use(app, ...middlewares);
      return app;
    },
    get(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.get(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });
      return app;
    },
    patch(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.patch(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });
      return app;
    },
    post(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.post(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });
      return app;
    },
    del(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.del(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });
      return app;
    },
    any(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.any(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });
      return app;
    },
    options(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.options(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });

      return app;
    },
    head(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.head(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });
      return app;
    },
    connect(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.connect(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });

      return app;
    },
    trace(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.trace(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });
      return app;
    },
    put(pattern: RecognizedString, ...middlewares: Handler[]) {
      uwsApp.put(pattern, async (res, req) => {
        await handler(res, req, middlewares);
      });
      return app;
    },
    listen(...args: Parameters<(typeof uwsApp)['listen']>) {
      uwsApp.listen(...args);
      return app;
    },
    listen():any
  };

  //   const ctx: Context = {
  //     middlewares: [],
  //     request: {} as any,
  //     response: {} as any,
  //     req: {} as any,
  //     res: {} as any,
  //     body: null,
  //   };

  return app;
};

const use = (
  app: ReturnType<typeof createApp>,
  ...middlewares: Middleware[]
) => {
  app.middlewares.push(...middlewares);
  return app;
};

const dispatch = async (ctx: Context, i = 0) => {
  const handler = ctx.middlewares[i];
  if (!handler) return;
  const next = () => dispatch(ctx, i + 1);
  await handler(ctx, next);
};

const app = createApp();
app.use(async (ctx, next) => {
  ctx.res.onAborted(() => {
    ctx.res.aborted = true;
  });
  console.log('middleware 1');
  await next();
  if (!ctx.res.aborted) {
    ctx.res.cork(() => {
      ctx.res.end(ctx.body || 'null');
    });
  }
  console.log('middleware 1 after next');
});

app
  .get('/', async ctx => {
    console.log('=========1');
    // if (!ctx.res.aborted) {
    //   ctx.res.cork(() => {
    //     ctx.res.end('Hello');
    //   });
    // }

    await new Promise(resolve => {
      setTimeout(() => {
        resolve(1);
      }, 10000);
    });

    return {
      message: 'Hello',
    };
  })
  .listen(8001, token => {
    if (token) {
      console.log('Listening on port 8001');
    }
  });
