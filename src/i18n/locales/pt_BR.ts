import type { LanguageMetadata, LanguageTranslation } from '../types';

export const pt_BR: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'Novo',
            browse: 'Abrir',
            tables: 'Tabelas',
            refs: 'Refs',
            dependencies: 'Dependências',
            custom_types: 'Tipos Personalizados',
            visuals: 'Visuais',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'Ações',
                new: 'Novo...',
                browse: 'Todos os bancos de dados...',
                save: 'Salvar',
                import: 'Importar Banco de Dados',
                export_sql: 'Exportar SQL',
                export_as: 'Exportar como',
                delete_diagram: 'Excluir',
            },
            edit: {
                edit: 'Editar',
                undo: 'Desfazer',
                redo: 'Refazer',
                clear: 'Limpar',
            },
            view: {
                view: 'Visualizar',
                show_sidebar: 'Mostrar Barra Lateral',
                hide_sidebar: 'Ocultar Barra Lateral',
                hide_cardinality: 'Ocultar Cardinalidade',
                show_cardinality: 'Mostrar Cardinalidade',
                hide_field_attributes: 'Ocultar Atributos de Campo',
                show_field_attributes: 'Mostrar Atributos de Campo',
                zoom_on_scroll: 'Zoom ao Rolar',
                show_views: 'Visualizações do Banco de Dados',
                theme: 'Tema',
                show_dependencies: 'Mostrar Dependências',
                hide_dependencies: 'Ocultar Dependências',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },
            backup: {
                backup: 'Backup',
                export_diagram: 'Exportar Diagrama',
                restore_diagram: 'Restaurar Diagrama',
            },
            help: {
                help: 'Ajuda',
                docs_website: 'Documentação',
            },
        },

        delete_diagram_alert: {
            title: 'Excluir Diagrama',
            description:
                'Esta ação não pode ser desfeita. Isso excluirá permanentemente o diagrama.',
            cancel: 'Cancelar',
            delete: 'Excluir',
        },

        clear_diagram_alert: {
            title: 'Limpar Diagrama',
            description:
                'Esta ação não pode ser desfeita. Isso excluirá permanentemente todos os dados do diagrama.',
            cancel: 'Cancelar',
            clear: 'Limpar',
        },

        reorder_diagram_alert: {
            title: 'Organizar Diagrama Automaticamente',
            description:
                'Esta ação reorganizará todas as tabelas no diagrama. Deseja continuar?',
            reorder: 'Organizar Automaticamente',
            cancel: 'Cancelar',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Falha na cópia',
                description: 'Área de transferência não suportada',
            },
            failed: {
                title: 'Falha na cópia',
                description: 'Algo deu errado. Por favor, tente novamente.',
            },
        },

        theme: {
            system: 'Sistema',
            light: 'Claro',
            dark: 'Escuro',
        },

        zoom: {
            on: 'Ativado',
            off: 'Desativado',
        },

        last_saved: 'Última vez salvo',
        saved: 'Salvo',
        loading_diagram: 'Carregando diagrama...',
        deselect_all: 'Desmarcar Todos',
        select_all: 'Selecionar Todos',
        clear: 'Limpar',
        show_more: 'Mostrar Mais',
        show_less: 'Mostrar Menos',
        copy_to_clipboard: 'Copiar para a Área de Transferência',
        copied: 'Copiado!',

        side_panel: {
            view_all_options: 'Ver todas as Opções...',
            tables_section: {
                tables: 'Tabelas',
                add_table: 'Adicionar Tabela',
                add_view: 'Adicionar Visualização',
                filter: 'Filtrar',
                collapse: 'Colapsar Todas',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'Todas as tabelas estão ocultas',
                show_all: 'Mostrar tudo',

                table: {
                    fields: 'Campos',
                    nullable: 'Permite Nulo?',
                    primary_key: 'Chave Primária',
                    indexes: 'Índices',
                    check_constraints: 'Restrições de verificação',
                    comments: 'Comentários',
                    no_comments: 'Sem comentários',
                    add_field: 'Adicionar Campo',
                    add_index: 'Adicionar Índice',
                    add_check: 'Adicionar verificação',
                    index_select_fields: 'Selecionar campos',
                    no_types_found: 'Nenhum tipo encontrado',
                    field_name: 'Nome',
                    field_type: 'Tipo',
                    field_actions: {
                        title: 'Atributos do Campo',
                        unique: 'Único',
                        auto_increment: 'Incremento Automático',
                        comments: 'Comentários',
                        no_comments: 'Sem comentários',
                        delete_field: 'Excluir Campo',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'Precisão',
                        scale: 'Escala',
                    },
                    index_actions: {
                        title: 'Atributos do Índice',
                        name: 'Nome',
                        unique: 'Único',
                        index_type: 'Tipo de Índice',
                        delete_index: 'Excluir Índice',
                    },
                    check_constraint_actions: {
                        title: 'Restrição de verificação',
                        expression: 'Expressão',
                        delete: 'Excluir restrição',
                    },
                    table_actions: {
                        title: 'Ações da Tabela',
                        change_schema: 'Alterar Esquema',
                        add_field: 'Adicionar Campo',
                        add_index: 'Adicionar Índice',
                        duplicate_table: 'Duplicate Table',
                        delete_table: 'Excluir Tabela',
                    },
                },
                empty_state: {
                    title: 'Sem tabelas',
                    description: 'Crie uma tabela para começar',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'Filtrar',
                collapse: 'Colapsar Todas',
                add_relationship: 'Adicionar Relacionamento',
                relationships: 'Relacionamentos',
                dependencies: 'Dependências',
                relationship: {
                    relationship: 'Relacionamento',
                    primary: 'Tabela Primária',
                    foreign: 'Tabela Relacionada',
                    cardinality: 'Cardinalidade',
                    delete_relationship: 'Excluir',
                    switch_tables: 'Trocar Tabelas',
                    relationship_actions: {
                        title: 'Ações',
                        delete_relationship: 'Excluir',
                    },
                },
                dependency: {
                    dependency: 'Dependência',
                    table: 'Tabela',
                    dependent_table: 'Visualização Dependente',
                    delete_dependency: 'Excluir',
                    dependency_actions: {
                        title: 'Ações',
                        delete_dependency: 'Excluir',
                    },
                },
                empty_state: {
                    title: 'Sem relacionamentos',
                    description: 'Crie um relacionamento para começar',
                },
            },

            areas_section: {
                areas: 'Áreas',
                add_area: 'Adicionar Área',
                filter: 'Filtrar',
                clear: 'Limpar Filtro',
                no_results:
                    'Nenhuma área encontrada correspondente ao seu filtro.',

                area: {
                    area_actions: {
                        title: 'Ações da Área',
                        edit_name: 'Editar Nome',
                        delete_area: 'Excluir Área',
                    },
                },
                empty_state: {
                    title: 'Sem áreas',
                    description: 'Crie uma área para começar',
                },
            },

            visuals_section: {
                visuals: 'Visuais',
                tabs: {
                    areas: 'Áreas',
                    notes: 'Notas',
                },
            },

            notes_section: {
                filter: 'Filtrar',
                add_note: 'Adicionar Nota',
                no_results: 'Nenhuma nota encontrada',
                clear: 'Limpar Filtro',
                empty_state: {
                    title: 'Sem Notas',
                    description:
                        'Crie uma nota para adicionar anotações de texto na tela',
                },
                note: {
                    empty_note: 'Nota vazia',
                    note_actions: {
                        title: 'Ações de Nota',
                        edit_content: 'Editar Conteúdo',
                        delete_note: 'Excluir Nota',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Tipos Personalizados',
                filter: 'Filtrar',
                clear: 'Limpar Filtro',
                no_results:
                    'Nenhum tipo personalizado encontrado correspondente ao seu filtro.',
                new_type: 'Novo Tipo',
                empty_state: {
                    title: 'Sem tipos personalizados',
                    description:
                        'Os tipos personalizados aparecerão aqui quando estiverem disponíveis no seu banco de dados',
                },
                custom_type: {
                    kind: 'Tipo',
                    enum_values: 'Valores Enum',
                    composite_fields: 'Campos',
                    no_fields: 'Nenhum campo definido',
                    no_values: 'Nenhum valor de enum definido',
                    field_name_placeholder: 'Nome do campo',
                    field_type_placeholder: 'Selecionar tipo',
                    add_field: 'Adicionar Campo',
                    no_fields_tooltip:
                        'Nenhum campo definido para este tipo personalizado',
                    custom_type_actions: {
                        title: 'Ações',
                        highlight_fields: 'Destacar Campos',
                        delete_custom_type: 'Excluir',
                        clear_field_highlight: 'Remover Destaque',
                    },
                    delete_custom_type: 'Excluir Tipo',
                },
            },
        },

        toolbar: {
            zoom_in: 'Aumentar Zoom',
            zoom_out: 'Diminuir Zoom',
            save: 'Salvar',
            show_all: 'Mostrar Tudo',
            undo: 'Desfazer',
            redo: 'Refazer',
            reorder_diagram: 'Organizar Diagrama Automaticamente',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'Destacar Tabelas Sobrepostas',
            filter: 'Filtrar Tabelas',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'Qual é o seu Banco de Dados?',
                description:
                    'Cada banco de dados possui recursos e capacidades únicas.',
                check_examples_long: 'Ver Exemplos',
                check_examples_short: 'Exemplos',
            },

            import_database: {
                title: 'Importe seu Banco de Dados',
                database_edition: 'Edição do Banco de Dados:',
                step_1: 'Execute este script no seu banco de dados:',
                step_2: 'Cole o resultado do script aqui →',
                script_results_placeholder: 'Resultados do script aqui...',
                ssms_instructions: {
                    button_text: 'Instruções do SSMS',
                    title: 'Instruções',
                    step_1: 'Vá para Ferramentas > Opções > Resultados da Consulta > SQL Server.',
                    step_2: 'Se estiver usando "Resultados para Grade," altere o Máximo de Caracteres para Dados Não-XML (definido para 9999999).',
                },
                instructions_link: 'Precisa de ajuda? Veja como',
                check_script_result: 'Verificar Resultado do Script',
            },

            cancel: 'Cancelar',
            back: 'Voltar',
            import_from_file: 'Import from File',
            empty_diagram: 'Banco de dados vazio',
            continue: 'Continuar',
            import: 'Importar',
        },

        open_diagram_dialog: {
            title: 'Abrir Banco de Dados',
            description: 'Selecione um diagrama para abrir da lista abaixo.',
            table_columns: {
                name: 'Nome',
                created_at: 'Criado em',
                last_modified: 'Última Modificação',
                tables_count: 'Tabelas',
            },
            cancel: 'Cancelar',
            open: 'Abrir',
            new_database: 'Novo Banco de Dados',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'Abrir',
                duplicate: 'Duplicar',
                delete: 'Excluir',
            },
        },

        export_sql_dialog: {
            title: 'Exportar SQL',
            description:
                'Exporte o esquema do seu diagrama para o script {{databaseType}}',
            close: 'Fechar',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'A IA está gerando SQL para {{databaseType}}...',
                description: 'Isso pode levar até 30 segundos.',
            },
            error: {
                message:
                    'Erro ao gerar o script SQL. Tente novamente mais tarde ou <0>entre em contato conosco</0>.',
                description:
                    'Sinta-se à vontade para usar seu OPENAI_TOKEN, veja o manual <0>aqui</0>.',
            },
        },

        create_relationship_dialog: {
            title: 'Criar Relacionamento',
            primary_table: 'Tabela Primária',
            primary_field: 'Campo Primário',
            referenced_table: 'Tabela Referenciada',
            referenced_field: 'Campo Referenciado',
            primary_table_placeholder: 'Selecionar tabela',
            primary_field_placeholder: 'Selecionar campo',
            referenced_table_placeholder: 'Selecionar tabela',
            referenced_field_placeholder: 'Selecionar campo',
            no_tables_found: 'Nenhuma tabela encontrada',
            no_fields_found: 'Nenhum campo encontrado',
            create: 'Criar',
            cancel: 'Cancelar',
        },

        import_database_dialog: {
            title: 'Importar para o Diagrama Atual',
            override_alert: {
                title: 'Importar Banco de Dados',
                content: {
                    alert: 'A importação deste diagrama afetará tabelas e relacionamentos existentes.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> novas tabelas serão adicionadas.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> novos relacionamentos serão criados.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> tabelas serão sobrescritas.',
                    proceed: 'Você deseja continuar?',
                },
                import: 'Importar',
                cancel: 'Cancelar',
            },
        },

        smart_query_wizard: {
            title: 'Smart Query Wizard',
            description:
                'SchemaFlow never asks for your database password. You copy a read-only metadata query, run it locally, then paste the JSON output here.',
            steps: {
                choose_database: {
                    title: 'Choose this database type',
                    description:
                        'The query is generated for the selected database and client.',
                },
                copy_query: {
                    title: 'Copy the Smart Query',
                    description:
                        'Run it in your own database client. No database password is required in SchemaFlow.',
                },
                paste_json: {
                    title: 'Paste the JSON result',
                    description:
                        'Only paste the metadata JSON returned by the query, not a connection string or secret.',
                },
                preview: {
                    title: 'Preview tables, relationships, and warnings',
                    description:
                        'SchemaFlow summarizes objects and dialect limitations before writing to the diagram.',
                },
                confirm: {
                    title: 'Confirm import',
                    description:
                        'Nothing is added to IndexedDB until you confirm the preview.',
                },
            },
        },

        export_image_dialog: {
            title: 'Exportar Imagem',
            description: 'Escolha o fator de escala para exportação:',
            scale_1x: '1x (Baixa Qualidade)',
            scale_2x: '2x (Qualidade Normal)',
            scale_4x: '4x (Melhor Qualidade)',
            cancel: 'Cancelar',
            export: 'Exportar',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'Selecionar Esquema',
            description:
                'Múltiplos esquemas estão sendo exibidos. Selecione um para a nova tabela.',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
        },

        update_table_schema_dialog: {
            title: 'Alterar Esquema',
            description: 'Atualizar o esquema da tabela "{{tableName}}"',
            cancel: 'Cancelar',
            confirm: 'Alterar',
        },

        create_table_schema_dialog: {
            title: 'Criar Novo Esquema',
            description:
                'Ainda não existem esquemas. Crie seu primeiro esquema para organizar suas tabelas.',
            create: 'Criar',
            cancel: 'Cancelar',
        },

        star_us_dialog: {
            title: 'Ajude-nos a melhorar!',
            description:
                'Gostaria de nos avaliar com uma estrela no GitHub? É apenas um clique!',
            close: 'Agora não',
            confirm: 'Claro!',
        },
        export_diagram_dialog: {
            title: 'Export Diagram',
            description: 'Choose the format for export:',
            format_json: 'JSON',
            cancel: 'Cancel',
            export: 'Export',
            error: {
                title: 'Error exporting diagram',
                description:
                    'Something went wrong. Need help? https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_diagram_dialog: {
            title: 'Import Diagram',
            description: 'Paste the diagram JSON below:',
            cancel: 'Cancel',
            import: 'Import',
            error: {
                title: 'Error importing diagram',
                description:
                    'The diagram JSON is invalid. Please check the JSON and try again. Need help? https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_dbml_dialog: {
            example_title: 'Import Example DBML',
            title: 'Import DBML',
            description: 'Import a database schema from DBML format.',
            import: 'Import',
            cancel: 'Cancel',
            skip_and_empty: 'Skip & Empty',
            show_example: 'Show Example',
            error: {
                title: 'Error',
                description: 'Failed to parse DBML. Please check the syntax.',
            },
        },
        relationship_type: {
            one_to_one: 'Um para Um',
            one_to_many: 'Um para Muitos',
            many_to_one: 'Muitos para Um',
            many_to_many: 'Muitos para Muitos',
        },

        canvas_context_menu: {
            new_table: 'Nova Tabela',
            new_view: 'Nova Visualização',
            new_relationship: 'Novo Relacionamento',
            new_area: 'Nova Área',
            new_note: 'Nova Nota',
        },

        table_node_context_menu: {
            edit_table: 'Editar Tabela',
            duplicate_table: 'Duplicate Table',
            delete_table: 'Excluir Tabela',
            add_relationship: 'Add Relationship',
            move_to_area: 'Mover para Área',
            no_area: 'Sem Área',
        },

        templates_page: {
            heading_featured: 'Featured database schema templates',
            heading_tagged: 'Database schema templates for {{tag}}',
            heading_all: 'Database schema templates',
            description:
                'Discover a collection of real-world database schema diagrams, featuring example applications and popular open-source projects.',
            description_tagged:
                'Discover a collection of real-world database schema diagrams for {{tag}}, featuring example applications and popular open-source projects.',
            navigation: {
                featured: 'Featured',
                all_templates: 'All Templates',
                tags: 'Tags',
            },
        },

        canvas: {
            all_tables_hidden: 'Todas as tabelas estão ocultas',
            show_all_tables: 'Mostrar tudo',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Filtrar Tabelas',
            search_placeholder: 'Pesquisar tabelas...',
            group_by_schema: 'Agrupar por Esquema',
            group_by_area: 'Agrupar por Área',
            no_tables_found: 'Nenhuma tabela encontrada',
            empty_diagram_description: 'Crie uma tabela para começar',
            no_tables_description: 'Tente ajustar sua pesquisa ou filtro',
            clear_filter: 'Limpar filtro',
        },

        snap_to_grid_tooltip: 'Snap to Grid (Hold {{key}})',

        tool_tips: {
            double_click_to_edit: 'Duplo clique para editar',
        },

        language_select: {
            change_language: 'Idioma',
        },

        on: 'Ligado',
        off: 'Desligado',

        settings: {
            dialog: {
                title: 'Settings',
                description:
                    'Manage local editor preferences, AI export mode, and browser-stored diagram data.',
            },
            display: {
                heading: 'Display',
                description: 'Keep editor preferences in this browser.',
                theme: 'Theme',
                theme_system: 'System',
                theme_light: 'Light',
                theme_dark: 'Dark',
                language: 'Language',
                show_minimap: 'Show mini map',
                show_field_attributes: 'Show field attributes',
                scroll_action: 'Canvas scroll action',
                scroll_action_pan: 'Pan canvas',
                scroll_action_zoom: 'Zoom canvas',
            },
            privacy: {
                session_only_title: 'Session-only settings',
                session_only_description:
                    'Browser settings are unavailable. Changes work for this session only.',
                ai_mode_heading: 'AI mode',
                ai_mode_description:
                    'Control whether SQL export can use AI assistance.',
                ai_export_mode_label: 'AI-assisted export mode',
                ai_export_mode_disabled: 'Disabled',
                ai_export_mode_byok: 'BYOK session',
                ai_export_mode_gateway: 'Self-hosted gateway',
                byok_alert_title: 'Session-only BYOK',
                byok_alert_line_1: 'Paste the API key only when exporting SQL.',
                byok_alert_line_2:
                    'BYOK keys are session-only and are never saved.',
                byok_never_saved:
                    'BYOK keys are session-only and are never saved.',
                byok_session_key_label: 'Session API key',
                byok_session_key_hint:
                    'Stored in memory only. Refreshing the page clears this key.',
                gateway_endpoint_label: 'Gateway endpoint',
                gateway_model_label: 'Model name',
                gateway_model_placeholder: 'Optional',
                data_management_heading: 'Data management',
                data_management_description:
                    'SchemaFlow stores diagrams in this browser with IndexedDB and localStorage. No account or cloud workspace is required.',
                export_backup_button: 'Export diagram backup',
                restore_backup_button: 'Restore from backup',
                backup_file_label: 'Backup file',
                clear_local_diagrams_button: 'Clear local diagrams',
                reading_backup_title: 'Reading backup',
                reading_backup_description:
                    'SchemaFlow is building a restore preview.',
                backup_restored_title: 'Backup restored',
                backup_restored_description:
                    'The selected backup has been restored as local diagram data.',
                restore_failed_title: 'Could not restore backup',
                restore_failed_default: 'Backup file could not be restored.',
                preview_failed_default: 'Backup file could not be previewed.',
                read_failed_default: 'Backup file could not be read.',
                cleared_title: 'Local diagrams cleared',
                cleared_description: 'All local diagrams have been deleted.',
                clear_failed_title: 'Could not clear local diagrams',
                clear_failed_default: 'Local diagrams could not be deleted.',
                clear_dialog_title: 'Delete all local diagrams?',
                clear_dialog_description:
                    'This deletes every diagram stored in this browser, including tables, relationships, notes, areas, custom types, and filters. Export a backup first if you need to keep a copy.',
                cancel: 'Cancel',
                deleting: 'Deleting...',
                delete_local_diagrams: 'Delete local diagrams',
                restore_dialog_title: 'Restore backup preview?',
                restore_dialog_description:
                    'Review the diagrams in this backup before restoring them into local browser storage.',
                diagram_singular: '{{count}} diagram in this backup.',
                diagram_plural: '{{count}} diagrams in this backup.',
                table_singular: '{{count}} table',
                table_plural: '{{count}} tables',
                relationship_singular: '{{count}} relationship',
                relationship_plural: '{{count}} relationships',
                restoring: 'Restoring...',
                restore_backup_action: 'Restore backup',
            },
            keyboard: {
                heading: 'Keyboard shortcuts',
                description:
                    'Core editor paths remain available without pointer-only controls.',
                undo: 'Undo diagram change',
                redo: 'Redo diagram change',
                command_actions: 'Open command actions',
                zoom_canvas: 'Zoom canvas',
                zoom_canvas_keys: 'Mouse wheel or toolbar controls',
            },
        },

        onboarding: {
            title: 'Start a SchemaFlow diagram',
            description:
                'Pick the database first, then choose whether to import, start blank, or explore templates.',
            database_heading: 'Database',
            start_option_heading: 'Start option',
            start_options: {
                import: {
                    title: 'Import existing database',
                    description:
                        'Start from SQL, DBML, or metadata and review it before saving.',
                },
                blank: {
                    title: 'New blank diagram',
                    description:
                        'Create an empty local diagram for manual modeling.',
                },
                template: {
                    title: 'Browse templates',
                    description:
                        'Open a realistic example and clone it into your workspace.',
                },
            },
            no_database_selected: 'No database selected',
            selected_label: 'Selected: {{label}}',
            choose_database_error:
                'Choose a database before creating or importing a diagram.',
            choose_start_option_error: 'Choose how you want to start.',
            create_failed_error:
                'SchemaFlow could not create the diagram. Nothing was saved; try again.',
            import_json_backup: 'Import JSON backup',
            continue: 'Continue',
            creating: 'Creating...',
        },
    },
};

export const pt_BRMetadata: LanguageMetadata = {
    name: 'Portuguese',
    nativeName: 'Português',
    code: 'pt_BR',
};
