import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { getSegmentCssWidth, CodeInput as Rsi } from 'rci';

import { useIsFocused } from '../hooks/use-is-focused';

type CodeState = 'input' | 'loading' | 'error' | 'success';
export const CodeInput = ({
    id,
    autoFocus,
    length,
    disabled,
    readOnly,
    className,
}: {
    id: string;
    length: number;
    disabled?: boolean;
    readOnly?: boolean;
    autoFocus?: boolean;
    className?: string;
}) => {
    const [state, setState] = useState<CodeState>('input');
    const inputRef = useRef<HTMLInputElement>(null);
    const focused = useIsFocused(inputRef);
    const padding = '10px';
    const width = getSegmentCssWidth(padding);
    const isError = state === 'error';

    return (
        <Rsi
            id={id}
            name={id}
            className={isError ? 'animate-bounce' : ''}
            inputClassName='caret-transparent selection:bg-transparent'
            autoFocus={autoFocus}
            length={length}
            readOnly={disabled}
            disabled={readOnly}
            inputRef={inputRef}
            padding={padding}
            spacing={padding}
            spellCheck={false}
            inputMode='numeric'
            pattern='[0-9]*'
            autoComplete='one-time-code'
            onChange={({ currentTarget: input }) => {
                // only accept numbers
                input.value = input.value.replace(/\D+/g, '');
            }}
            renderSegment={(segment) => {
                const isCaret = focused && segment.state === 'cursor';
                const isSelection = focused && segment.state === 'selected';
                const isActive = isSelection || isCaret;

                const outerClassName = cn(
                    'flex h-full appearance-none rounded-md border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state="error"]:ring-destructive data-[state="error"]:ring-offset-2 data-[state="success"]:ring-success data-[state="success"]:ring-offset-2',
                    isActive && 'data-[state]:border-primary shadow-md',
                );

                const caretClassName =
                    'flex-[0_0_2px] justify-self-center mx-auto my-2 w-0.5 bg-black animate-[blink-caret_1.2s_step-end_infinite]';
                const selectionClassName =
                    'flex-1 m-[3px] rounded-sm bg-[var(--segment-color)] opacity-[0.15625]';

                const innerClassName = cn(
                    isSelection && selectionClassName,
                    isCaret && caretClassName,
                );

                return (
                    <div
                        key={segment.index}
                        data-state={state}
                        className={cn(outerClassName, className)}
                        style={{ width }}
                        children={<div className={innerClassName} />}
                    />
                );
            }}
        />
    );
};
