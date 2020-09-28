import { Next, PipelineOptions, Middleware, Context } from './pipeline';
import * as Schema from './schema';
export interface RouterPipelineOptions<I, O> extends PipelineOptions<O> {
    input: Schema.Type<I>;
    output: Schema.Type<O>;
}
export declare type RouterPipeline<I, O> = {
    middleware: <T>(input: T, next: Next<T, O>) => O;
    add: (input: Middleware<I, O>) => void;
    run: (input: I, context?: Context | undefined) => O;
};
export declare const createRouterPipeline: <I, O>(options: RouterPipelineOptions<I, O>) => RouterPipeline<I, O>;