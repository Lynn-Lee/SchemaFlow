import type { LanguageMetadata, LanguageTranslation } from '../types';

export const zh_CN: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: '新建',
            browse: '打开',
            tables: '表',
            refs: '引用',
            dependencies: '依赖关系',
            custom_types: '自定义类型',
            visuals: '视觉效果',
        },
        menu: {
            actions: {
                actions: '操作',
                new: '新建...',
                browse: '所有数据库...',
                save: '保存',
                import: '导入数据库',
                export_sql: '导出 SQL 语句',
                export_as: '导出为',
                delete_diagram: '删除',
            },
            edit: {
                edit: '编辑',
                undo: '撤销',
                redo: '重做',
                clear: '清空',
            },
            view: {
                view: '视图',
                show_sidebar: '展示侧边栏',
                hide_sidebar: '隐藏侧边栏',
                hide_cardinality: '隐藏基数',
                show_cardinality: '展示基数',
                show_field_attributes: '展示字段属性',
                hide_field_attributes: '隐藏字段属性',
                zoom_on_scroll: '滚动缩放',
                show_views: '数据库视图',
                theme: '主题',
                show_dependencies: '展示依赖',
                hide_dependencies: '隐藏依赖',
                show_minimap: '展示迷你地图',
                hide_minimap: '隐藏迷你地图',
            },
            backup: {
                backup: '备份',
                export_diagram: '导出关系图',
                restore_diagram: '还原图表',
            },
            help: {
                help: '帮助',
                docs_website: '文档',
                join_discord: '在 Discord 上加入我们',
            },
        },

        delete_diagram_alert: {
            title: '删除关系图',
            description: '此操作无法撤销。这将永久删除关系图。',
            cancel: '取消',
            delete: '删除',
        },

        clear_diagram_alert: {
            title: '清除关系图',
            description: '此操作无法撤销。这将永久删除关系图中的所有数据。',
            cancel: '取消',
            clear: '清空',
        },

        reorder_diagram_alert: {
            title: '自动排列关系图',
            description: '此操作将重新排列关系图中的所有表。是否要继续？',
            reorder: '自动排列',
            cancel: '取消',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: '复制失败',
                description: '不支持剪贴板',
            },
            failed: {
                title: '复制失败',
                description: '出现问题。请再试一次。',
            },
        },

        theme: {
            system: '系统',
            light: '浅色',
            dark: '深色',
        },

        zoom: {
            on: '启用',
            off: '禁用',
        },

        last_saved: '上次保存时间：',
        saved: '已保存',
        loading_diagram: '加载关系图...',
        deselect_all: '取消全选',
        select_all: '全选',
        clear: '清空',
        show_more: '展开',
        show_less: '收起',
        copy_to_clipboard: '复制到剪切板',
        copied: '复制了！',

        side_panel: {
            view_all_options: '查看所有选项...',
            tables_section: {
                tables: '表',
                add_table: '添加表',
                add_view: '添加视图',
                filter: '筛选',
                collapse: '全部折叠',
                clear: '清除筛选',
                no_results: '未找到符合筛选条件的表格。',
                show_list: '显示表格列表',
                show_dbml: '显示 DBML 编辑器',
                all_hidden: '所有表格已隐藏',
                show_all: '显示全部',

                table: {
                    fields: '字段',
                    nullable: '可为空？',
                    primary_key: '主键',
                    indexes: '索引',
                    check_constraints: '检查约束',
                    comments: '注释',
                    no_comments: '空',
                    add_field: '添加字段',
                    add_index: '添加索引',
                    add_check: '添加检查',
                    index_select_fields: '选择字段',
                    no_types_found: '未找到类型',
                    field_name: '名称',
                    field_type: '类型',
                    field_actions: {
                        title: '字段属性',
                        unique: '唯一',
                        auto_increment: '自动递增',
                        comments: '注释',
                        no_comments: '空',
                        delete_field: '删除字段',
                        default_value: '默认值',
                        no_default: '无默认值',
                        character_length: '最大长度',
                        precision: '精度',
                        scale: '小数位',
                    },
                    index_actions: {
                        title: '索引属性',
                        name: '名称',
                        unique: '唯一',
                        index_type: '索引类型',
                        delete_index: '删除索引',
                    },
                    check_constraint_actions: {
                        title: '检查约束',
                        expression: '表达式',
                        delete: '删除检查约束',
                    },
                    table_actions: {
                        title: '表操作',
                        change_schema: '更改模式',
                        add_field: '添加字段',
                        add_index: '添加索引',
                        duplicate_table: '复制表',
                        delete_table: '删除表',
                    },
                },
                empty_state: {
                    title: '没有表',
                    description: '新建表以开始',
                },
            },
            refs_section: {
                refs: '引用',
                filter: '筛选',
                collapse: '全部折叠',
                add_relationship: '添加关系',
                relationships: '关系',
                dependencies: '依赖关系',
                relationship: {
                    relationship: '关系',
                    primary: '主表',
                    foreign: '关联表',
                    cardinality: '基数',
                    delete_relationship: '删除',
                    switch_tables: '切换表',
                    relationship_actions: {
                        title: '操作',
                        delete_relationship: '删除',
                    },
                },
                dependency: {
                    dependency: '依赖',
                    table: '表',
                    dependent_table: '依赖视图',
                    delete_dependency: '删除',
                    dependency_actions: {
                        title: '操作',
                        delete_dependency: '删除',
                    },
                },
                empty_state: {
                    title: '无关系',
                    description: '创建关系以开始',
                },
            },

            areas_section: {
                areas: '区域',
                add_area: '添加区域',
                filter: '筛选',
                clear: '清除筛选',
                no_results: '未找到符合筛选条件的区域。',

                area: {
                    area_actions: {
                        title: '区域操作',
                        edit_name: '编辑名称',
                        delete_area: '删除区域',
                    },
                },
                empty_state: {
                    title: '没有区域',
                    description: '创建区域以开始',
                },
            },

            visuals_section: {
                visuals: '视觉效果',
                tabs: {
                    areas: '区域',
                    notes: '笔记',
                },
            },

            notes_section: {
                filter: '筛选',
                add_note: '添加笔记',
                no_results: '未找到笔记',
                clear: '清除筛选',
                empty_state: {
                    title: '没有笔记',
                    description: '创建笔记以在画布上添加文本注释',
                },
                note: {
                    empty_note: '空笔记',
                    note_actions: {
                        title: '笔记操作',
                        edit_content: '编辑内容',
                        delete_note: '删除笔记',
                    },
                },
            },

            custom_types_section: {
                custom_types: '自定义类型',
                filter: '筛选',
                clear: '清除筛选',
                no_results: '未找到符合筛选条件的自定义类型。',
                new_type: '新类型',
                empty_state: {
                    title: '没有自定义类型',
                    description:
                        '当数据库中有可用的自定义类型时，它们将显示在这里',
                },
                custom_type: {
                    kind: '类型',
                    enum_values: '枚举值',
                    composite_fields: '字段',
                    no_fields: '未定义字段',
                    no_values: '没有定义枚举值',
                    field_name_placeholder: '字段名称',
                    field_type_placeholder: '选择类型',
                    add_field: '添加字段',
                    no_fields_tooltip: '此自定义类型未定义字段',
                    custom_type_actions: {
                        title: '操作',
                        highlight_fields: '高亮字段',
                        delete_custom_type: '删除',
                        clear_field_highlight: '清除高亮',
                    },
                    delete_custom_type: '删除类型',
                },
            },
        },

        toolbar: {
            zoom_in: '放大',
            zoom_out: '缩小',
            save: '保存',
            show_all: '展示全部',
            undo: '撤销',
            redo: '重做',
            reorder_diagram: '自动排列关系图',
            clear_custom_type_highlight: '清除 "{{typeName}}" 的高亮',
            custom_type_highlight_tooltip:
                '正在高亮 "{{typeName}}" - 点击以清除',
            highlight_overlapping_tables: '突出显示重叠的表',
            filter: '筛选表',
        },

        new_diagram_dialog: {
            database_selection: {
                title: '您是哪种数据库？',
                description: '每种数据库都有其特性和功能。',
                check_examples_long: '查看样例',
                check_examples_short: '样例',
            },

            import_database: {
                title: '导入您的数据库',
                database_edition: '数据库类型：',
                step_1: '在您的数据库中执行以下脚本：',
                step_2: '将结果粘贴于此 →',
                script_results_placeholder: '结果...',
                ssms_instructions: {
                    button_text: 'SSMS 说明',
                    title: '说明',
                    step_1: '前往 工具 > 选项 > 查询结果 > SQL Server。',
                    step_2: '如果您使用“Result to Grid”功能，请将非 XML 数据的最大提取字符数更改为 9999999。',
                },
                instructions_link: '需要帮助？看看如何操作',
                check_script_result: '检查脚本结果',
            },

            cancel: '取消',
            import_from_file: '从文件导入',
            back: '上一步',
            empty_diagram: '空数据库',
            continue: '下一步',
            import: '导入',
        },

        open_diagram_dialog: {
            title: '打开数据库',
            description: '从下面的列表中选择一个图表打开。',
            table_columns: {
                name: '名称',
                created_at: '创建于',
                last_modified: '最后修改于',
                tables_count: '表数量',
            },
            cancel: '取消',
            open: '打开',
            new_database: '新建数据库',

            diagram_actions: {
                open: '打开',
                duplicate: '复制',
                delete: '删除',
            },
        },

        export_sql_dialog: {
            title: '导出 SQL 语句',
            description: '将您的图表模式导出为 {{databaseType}} 脚本。',
            close: '关闭',
            mode: {
                deterministic: '确定性',
                ai: 'AI',
            },
            loading: {
                text: 'AI 正在为 {{databaseType}} 生成 SQL 语句...',
                description: '此操作最多需要 30 秒。',
            },
            error: {
                message:
                    '生成 SQL 脚本时出错。请稍后再试，或者 <0>联系我们</0>。',
                description:
                    '随时使用您的 OPENAI_TOKEN，在<0>这里</0>查看手册。',
            },
        },

        create_relationship_dialog: {
            title: '创建关系',
            primary_table: '主表',
            primary_field: '主键字段',
            referenced_table: '被引用表',
            referenced_field: '被引用字段',
            primary_table_placeholder: '选择表',
            primary_field_placeholder: '选择字段',
            referenced_table_placeholder: '选择表',
            referenced_field_placeholder: '选择字段',
            no_tables_found: '未找到表',
            no_fields_found: '未找到字段',
            create: '创建',
            cancel: '取消',
        },

        import_database_dialog: {
            title: '导入到当前关系图',
            override_alert: {
                title: '导入数据库',
                content: {
                    alert: '导入此关系图将影响现有的表和关系。',
                    new_tables:
                        '将添加 <bold>{{newTablesNumber}}</bold> 个新表。',
                    new_relationships:
                        '将创建 <bold>{{newRelationshipsNumber}}</bold> 个新关系。',
                    tables_override:
                        '将覆盖 <bold>{{tablesOverrideNumber}}</bold> 个表。',
                    proceed: '您是否要继续操作？',
                },
                import: '导入',
                cancel: '取消',
            },
        },

        smart_query_wizard: {
            title: 'Smart Query 向导',
            description:
                'SchemaFlow 不会要求你的数据库密码。你只需复制只读元数据查询，在本地运行，然后将 JSON 输出粘贴到这里。',
            steps: {
                choose_database: {
                    title: '选择当前数据库类型',
                    description: '查询会根据已选择的数据库和客户端生成。',
                },
                copy_query: {
                    title: '复制 Smart Query',
                    description:
                        '在你自己的数据库客户端中运行它。SchemaFlow 不需要数据库密码。',
                },
                paste_json: {
                    title: '粘贴 JSON 结果',
                    description:
                        '只粘贴查询返回的元数据 JSON，不要粘贴连接串或密钥。',
                },
                preview: {
                    title: '预览表、关系和警告',
                    description:
                        'SchemaFlow 会在写入关系图前汇总对象和方言限制。',
                },
                confirm: {
                    title: '确认导入',
                    description: '只有确认预览后，内容才会写入 IndexedDB。',
                },
            },
        },

        export_image_dialog: {
            title: '导出图片',
            description: '选择导出的缩放比例：',
            scale_1x: '1x (低质量)',
            scale_2x: '2x (普通质量)',
            scale_4x: '4x (最佳质量)',
            cancel: '取消',
            export: '导出',
            advanced_options: '高级选项',
            pattern: '包含背景图案',
            pattern_description: '为背景添加细微的网格图案。',
            transparent: '透明背景',
            transparent_description: '移除图片的背景颜色。',
        },

        new_table_schema_dialog: {
            title: '选择模式',
            description: '当前显示多个模式。请选择一个用于新表。',
            cancel: '取消',
            confirm: '确认',
        },

        update_table_schema_dialog: {
            title: '更改模式',
            description: '更新表 "{{tableName}}" 的模式。',
            cancel: '取消',
            confirm: '更改',
        },

        create_table_schema_dialog: {
            title: '创建新模式',
            description: '尚未存在任何模式。创建您的第一个模式来组织您的表。',
            create: '创建',
            cancel: '取消',
        },

        star_us_dialog: {
            title: '帮助我们改进！',
            description: '您想在 GitHub 上为我们加注星标吗？只需点击一下即可！',
            close: '以后再说',
            confirm: '当然！',
        },
        export_diagram_dialog: {
            title: '导出关系图',
            description: '选择导出格式：',
            format_json: 'JSON',
            cancel: '取消',
            export: '导出',
            error: {
                title: '导出关系图时出错',
                description:
                    '出现问题。需要帮助？请访问 https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },

        import_diagram_dialog: {
            title: '导入关系图',
            description: '在下方粘贴关系图的 JSON：',
            cancel: '取消',
            import: '导入',
            error: {
                title: '导入关系图时出错',
                description:
                    '关系图 JSON 无效，请检查 JSON 后重试。需要帮助？ 联系 https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_dbml_dialog: {
            example_title: '导入 DBML 示例',
            title: '导入 DBML',
            description: '从 DBML 格式导入数据库模式。',
            import: '导入',
            cancel: '取消',
            skip_and_empty: '跳过并清空',
            show_example: '显示示例',
            error: {
                title: '导入 DBML 时出错',
                description: '解析 DBML 失败，请检查语法。',
            },
        },
        relationship_type: {
            one_to_one: '一对一',
            one_to_many: '一对多',
            many_to_one: '多对一',
            many_to_many: '多对多',
        },

        canvas_context_menu: {
            new_table: '新建表',
            new_view: '新建视图',
            new_relationship: '新建关系',
            new_area: '新建区域',
            new_note: '新笔记',
        },

        table_node_context_menu: {
            edit_table: '编辑表',
            duplicate_table: '复制表',
            delete_table: '删除表',
            add_relationship: '添加关系',
            move_to_area: '移动到区域',
            no_area: '无区域',
        },

        templates_page: {
            heading_featured: '精选数据库 schema 模板',
            heading_tagged: '{{tag}} 数据库 schema 模板',
            heading_all: '数据库 schema 模板',
            description:
                '浏览真实世界的数据库 schema 图集合，涵盖示例应用和热门开源项目。',
            description_tagged:
                '浏览 {{tag}} 的真实世界数据库 schema 图集合，涵盖示例应用和热门开源项目。',
            navigation: {
                featured: '精选',
                all_templates: '全部模板',
                tags: '标签',
            },
        },

        canvas: {
            all_tables_hidden: '所有表格已隐藏',
            show_all_tables: '显示全部',
            mobile_notice: {
                title: '移动端编辑体验有限',
                description:
                    '为了获得稳定的画布编辑体验，建议使用桌面浏览器。你仍然可以在当前设备继续操作。',
                dismiss: '关闭移动端画布提示',
            },
        },

        canvas_filter: {
            title: '筛选表格',
            search_placeholder: '搜索表格...',
            group_by_schema: '按模式分组',
            group_by_area: '按区域分组',
            no_tables_found: '未找到表格',
            empty_diagram_description: '创建表格以开始',
            no_tables_description: '尝试调整您的搜索或筛选',
            clear_filter: '清除筛选',
        },

        snap_to_grid_tooltip: '对齐到网格（按住 {{key}}）',

        tool_tips: {
            double_click_to_edit: '双击编辑',
        },

        language_select: {
            change_language: '语言',
        },

        on: '开启',
        off: '关闭',

        settings: {
            dialog: {
                title: '设置',
                description:
                    '管理本地编辑器偏好设置、AI 导出模式和浏览器存储的图表数据。',
            },
            display: {
                heading: '显示',
                description: '编辑器偏好设置保存在此浏览器中。',
                theme: '主题',
                theme_system: '系统',
                theme_light: '浅色',
                theme_dark: '深色',
                language: '语言',
                show_minimap: '展示迷你地图',
                show_field_attributes: '展示字段属性',
                scroll_action: '画布滚动行为',
                scroll_action_pan: '平移画布',
                scroll_action_zoom: '缩放画布',
            },
            privacy: {
                session_only_title: '仅本次会话生效的设置',
                session_only_description:
                    '浏览器设置不可用，更改仅在本次会话中生效。',
                ai_mode_heading: 'AI 模式',
                ai_mode_description: '控制 SQL 导出是否可以使用 AI 辅助。',
                ai_export_mode_label: 'AI 辅助导出模式',
                ai_export_mode_disabled: '已禁用',
                ai_export_mode_byok: 'BYOK 会话模式',
                ai_export_mode_gateway: '自托管网关',
                byok_alert_title: '仅本次会话的 BYOK',
                byok_alert_line_1: '仅在导出 SQL 时粘贴 API key。',
                byok_alert_line_2: 'BYOK key 仅在本次会话中有效，不会被保存。',
                byok_never_saved: 'BYOK key 仅在本次会话中有效，不会被保存。',
                byok_session_key_label: '会话 API key',
                byok_session_key_hint:
                    '仅保存在内存中，刷新页面后会清除此 key。',
                gateway_endpoint_label: '网关地址',
                gateway_model_label: '模型名称',
                gateway_model_placeholder: '可选',
                data_management_heading: '数据管理',
                data_management_description:
                    'SchemaFlow 使用 IndexedDB 和 localStorage 将图表数据存储在此浏览器中，无需账号或云端工作区。',
                export_backup_button: '导出图表备份',
                restore_backup_button: '从备份恢复',
                backup_file_label: '备份文件',
                clear_local_diagrams_button: '清除本地图表',
                reading_backup_title: '正在读取备份',
                reading_backup_description: 'SchemaFlow 正在生成恢复预览。',
                backup_restored_title: '备份已恢复',
                backup_restored_description: '所选备份已恢复为本地图表数据。',
                restore_failed_title: '无法恢复备份',
                restore_failed_default: '备份文件恢复失败。',
                preview_failed_default: '备份文件预览失败。',
                read_failed_default: '备份文件读取失败。',
                cleared_title: '本地图表已清除',
                cleared_description: '所有本地图表均已删除。',
                clear_failed_title: '无法清除本地图表',
                clear_failed_default: '本地图表删除失败。',
                clear_dialog_title: '删除全部本地图表？',
                clear_dialog_description:
                    '此操作将删除此浏览器中存储的所有图表，包括表、关系、笔记、区域、自定义类型和筛选条件。如需保留副本，请先导出备份。',
                cancel: '取消',
                deleting: '正在删除...',
                delete_local_diagrams: '删除本地图表',
                restore_dialog_title: '恢复备份预览？',
                restore_dialog_description:
                    '在恢复到本地浏览器存储之前，请先查看此备份中的图表。',
                diagram_singular: '此备份中有 {{count}} 个图表。',
                diagram_plural: '此备份中有 {{count}} 个图表。',
                table_singular: '{{count}} 个表',
                table_plural: '{{count}} 个表',
                relationship_singular: '{{count}} 个关系',
                relationship_plural: '{{count}} 个关系',
                restoring: '正在恢复...',
                restore_backup_action: '恢复备份',
            },
            keyboard: {
                heading: '键盘快捷键',
                description: '核心编辑操作无需依赖鼠标即可完成。',
                undo: '撤销图表更改',
                redo: '重做图表更改',
                command_actions: '打开命令面板',
                zoom_canvas: '缩放画布',
                zoom_canvas_keys: '鼠标滚轮或工具栏控件',
            },
        },
    },
};

export const zh_CNMetadata: LanguageMetadata = {
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    code: 'zh_CN',
};
