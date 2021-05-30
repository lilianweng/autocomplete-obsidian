import { TokenizeStrategy } from 'src/providers/flow/tokenizer'

export class AutocompleteSettings {
  enabled: boolean = true

  autoSelect: boolean = false
  autoTrigger: boolean = true
  autoTriggerMinSize: number = 4

  /*
   * Trigger on ctrl-p/n bindings
   */
  triggerLikeVim: boolean = false

  // TODO: Refactor provider settings
  latexProvider: boolean = true
  flowProvider: boolean = true
  flowProviderScanCurrent: boolean = true
  flowProviderTokenizeStrategy: TokenizeStrategy = 'default'
}
