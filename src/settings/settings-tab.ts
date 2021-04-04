import { App, Notice, PluginSettingTab, Setting } from 'obsidian'
import {
  TokenizeStrategy,
  TOKENIZE_STRATEGIES,
} from 'src/providers/flow/tokenizer'
import AutocompletePlugin from '../main'

export class AutocompleteSettingsTab extends PluginSettingTab {
  plugin: AutocompletePlugin

  constructor(app: App, plugin: AutocompletePlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()

    containerEl.createEl('h2', { text: 'Autocomplete Settings' })

    new Setting(containerEl)
      .setName('Enabled')
      .setDesc('Set the autocomplete state')
      .addToggle((cb) =>
        cb.setValue(this.plugin.settings.enabled).onChange((value) => {
          this.plugin.settings.enabled = value
          this.plugin.saveData(this.plugin.settings)
          this.plugin.refresh()
        })
      )

    new Setting(containerEl)
      .setName('Trigger like Vim autocomplete')
      .setDesc('Use CTRL-P/N bindings to trigger autocomplete. Be aware of keybinding clash on Windows (ctrl-n)')
      .addToggle((cb) =>
        cb.setValue(this.plugin.settings.triggerLikeVim).onChange((value) => {
          this.plugin.settings.triggerLikeVim = value
          this.plugin.saveData(this.plugin.settings)
          this.plugin.refresh()
        })
      )

    // Providers
    new Setting(containerEl)
      .setName('Text Providers')
      .setDesc(
        'The providers below suggest completions based on input. Be aware that enabling multiple providers can decrease performance.'
      )
      .setHeading()

    new Setting(containerEl)
      .setClass('no-border-top')
      .setName('LaTex Provider')
      .setDesc('Toggle LaTex suggestions')
      .addToggle((cb) =>
        cb.setValue(this.plugin.settings.latexProvider).onChange((value) => {
          this.plugin.settings.latexProvider = value
          this.plugin.saveData(this.plugin.settings)
          this.plugin.refresh()
        })
      )

    new Setting(containerEl)
      .setName('Flow Provider')
      .setDesc('Learns as you type. For now limited to current session.')
      .addToggle((cb) =>
        cb.setValue(this.plugin.settings.flowProvider).onChange((value) => {
          this.plugin.settings.flowProvider = value
          if (!value)
            // Scan current file can be enabled only if flow provider is
            this.plugin.settings.flowProviderScanCurrent = false

          this.plugin.saveData(this.plugin.settings)
          this.plugin.refresh()
        })
      )

    new Setting(containerEl)
      .setName('Flow Provider: Scan strategy')
      .setDesc('Choose the default scan strategy')
      .addDropdown((cb) => {
        // Add options
        TOKENIZE_STRATEGIES.forEach((strategy) => {
          const capitalized = strategy.replace(/^\w/, (c) =>
            c.toLocaleUpperCase()
          )
          cb.addOption(strategy, capitalized)
        })

        const settings = this.plugin.settings
        cb.setValue(settings.flowProviderTokenizeStrategy).onChange(
          (value: TokenizeStrategy) => {
            if (settings.flowProvider) {
              this.plugin.settings.flowProviderTokenizeStrategy = value
              this.plugin.saveData(this.plugin.settings)
              this.plugin.refresh()
            } else {
              new Notice('Cannot change because flow provider is not enabled.')
            }
          }
        )
      })

    // TODO: Improve UI reactivity when parent setting is disabled
    new Setting(containerEl)
      .setName('Flow Provider: Scan current file')
      .setDesc(
        'Provides current file text suggestions. Be aware of performance issues with large files.'
      )
      .addToggle((cb) => {
        const settings = this.plugin.settings
        cb.setValue(
          settings.flowProvider && settings.flowProviderScanCurrent
        ).onChange((value) => {
          if (settings.flowProvider) {
            this.plugin.settings.flowProviderScanCurrent = value
            this.plugin.saveData(this.plugin.settings)
            this.plugin.refresh()
          } else if (value) {
            // Cannot enable plugin
            cb.setValue(false)
            new Notice('Cannot activate because flow provider is not enabled.')
          }
        })
      })
  }
}
