import { describe, it, expect } from 'vitest';
import { esc, providerBadgeHTML, typingIndicatorHTML } from '../chat';

// ── esc() ─────────────────────────────────────────────────────────────────────

describe('esc()', () => {
  it('escapes ampersands', () => {
    expect(esc('a & b')).toBe('a &amp; b');
  });

  it('escapes less-than', () => {
    expect(esc('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater-than', () => {
    expect(esc('a > b')).toBe('a &gt; b');
  });

  it('escapes double quotes', () => {
    expect(esc('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes all four characters in one string', () => {
    expect(esc('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  });

  it('returns empty string unchanged', () => {
    expect(esc('')).toBe('');
  });

  it('leaves plain text unchanged', () => {
    expect(esc('hello world')).toBe('hello world');
  });

  it('coerces non-string input to string', () => {
    // @ts-expect-error — testing runtime coercion
    expect(esc(42)).toBe('42');
  });
});


// ── providerBadgeHTML() ───────────────────────────────────────────────────────

describe('providerBadgeHTML()', () => {
  it('claude → provider-pill--claude class and "Claude" label', () => {
    const html = providerBadgeHTML('claude');
    expect(html).toContain('provider-pill--claude');
    expect(html).toContain('Claude');
  });

  it('openai → provider-pill--openai class and "GPT" label', () => {
    const html = providerBadgeHTML('openai');
    expect(html).toContain('provider-pill--openai');
    expect(html).toContain('GPT');
  });

  it('gemini → provider-pill--gemini class and "Gemini" label', () => {
    const html = providerBadgeHTML('gemini');
    expect(html).toContain('provider-pill--gemini');
    expect(html).toContain('Gemini');
  });

  it('unknown provider → provider-pill--default class and raw string as label', () => {
    const html = providerBadgeHTML('llama');
    expect(html).toContain('provider-pill--default');
    expect(html).toContain('llama');
  });

  it('returns a <span> element string', () => {
    const html = providerBadgeHTML('claude');
    expect(html.trim()).toMatch(/^<span/);
    expect(html).toContain('</span>');
  });

  it('always includes a visible text label alongside the color class', () => {
    for (const p of ['claude', 'openai', 'gemini', 'other']) {
      const html = providerBadgeHTML(p);
      const container = document.createElement('div');
      container.innerHTML = html;
      expect(container.textContent?.trim().length).toBeGreaterThan(0);
    }
  });
});


// ── typingIndicatorHTML() ─────────────────────────────────────────────────────

describe('typingIndicatorHTML()', () => {
  it('contains exactly three .typing-dot spans', () => {
    const container = document.createElement('div');
    container.innerHTML = typingIndicatorHTML();
    expect(container.querySelectorAll('.typing-dot')).toHaveLength(3);
  });

  it('has aria-label="AI is typing"', () => {
    const container = document.createElement('div');
    container.innerHTML = typingIndicatorHTML();
    expect(container.querySelector('[aria-label="AI is typing"]')).not.toBeNull();
  });

  it('has role="status"', () => {
    const container = document.createElement('div');
    container.innerHTML = typingIndicatorHTML();
    expect(container.querySelector('[role="status"]')).not.toBeNull();
  });

  it('is a parseable HTML string (no syntax errors)', () => {
    const container = document.createElement('div');
    expect(() => { container.innerHTML = typingIndicatorHTML(); }).not.toThrow();
    expect(container.children.length).toBeGreaterThan(0);
  });
});
