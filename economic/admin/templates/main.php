<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <div class="notice notice-info">
        <p><?php _e('このプラグインを使用するには、以下のショートコードをページまたは投稿に挿入してください:', 'hoi4-economic-simulator'); ?></p>
        <code>[hoi4_economic_simulator]</code>
    </div>

    <div class="card">
        <h2><?php _e('使用方法', 'hoi4-economic-simulator'); ?></h2>
        <p><?php _e('HOI4 Economic Simulatorは、以下の方法で使用できます:', 'hoi4-economic-simulator'); ?></p>
        <ol>
            <li><?php _e('ショートコードをページに挿入', 'hoi4-economic-simulator'); ?></li>
            <li><?php _e('必要に応じてオプションを設定', 'hoi4-economic-simulator'); ?></li>
            <li><?php _e('プレビューを確認', 'hoi4-economic-simulator'); ?></li>
        </ol>
    </div>

    <div class="card">
        <h2><?php _e('ショートコードオプション', 'hoi4-economic-simulator'); ?></h2>
        <table class="form-table">
            <tr>
                <th scope="row"><?php _e('幅', 'hoi4-economic-simulator'); ?></th>
                <td>
                    <code>width="100%"</code>
                    <p class="description"><?php _e('ゲーム画面の幅を指定します。CSSの幅指定が使用可能です。', 'hoi4-economic-simulator'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('高さ', 'hoi4-economic-simulator'); ?></th>
                <td>
                    <code>height="800px"</code>
                    <p class="description"><?php _e('ゲーム画面の高さを指定します。CSSの高さ指定が使用可能です。', 'hoi4-economic-simulator'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('テーマ', 'hoi4-economic-simulator'); ?></th>
                <td>
                    <code>theme="dark"</code>
                    <p class="description"><?php _e('ゲームのテーマを指定します。"dark"または"light"が使用可能です。', 'hoi4-economic-simulator'); ?></p>
                </td>
            </tr>
        </table>
    </div>

    <div class="card">
        <h2><?php _e('使用例', 'hoi4-economic-simulator'); ?></h2>
        <p><?php _e('以下は、カスタマイズされたショートコードの例です:', 'hoi4-economic-simulator'); ?></p>
        <code>[hoi4_economic_simulator width="1200px" height="900px" theme="dark"]</code>
    </div>

    <div class="card">
        <h2><?php _e('プレビュー', 'hoi4-economic-simulator'); ?></h2>
        <div class="hoi4-simulator-preview">
            <?php echo do_shortcode('[hoi4_economic_simulator width="100%" height="600px"]'); ?>
        </div>
    </div>

    <div class="card">
        <h2><?php _e('トラブルシューティング', 'hoi4-economic-simulator'); ?></h2>
        <ul>
            <li>
                <strong><?php _e('ゲームが表示されない:', 'hoi4-economic-simulator'); ?></strong>
                <p><?php _e('JavaScriptが有効になっていることを確認してください。また、ブラウザのコンソールでエラーメッセージを確認してください。', 'hoi4-economic-simulator'); ?></p>
            </li>
            <li>
                <strong><?php _e('レイアウトが崩れる:', 'hoi4-economic-simulator'); ?></strong>
                <p><?php _e('テーマのCSSとの競合が考えられます。width属性とheight属性を調整してみてください。', 'hoi4-economic-simulator'); ?></p>
            </li>
            <li>
                <strong><?php _e('パフォーマンスの問題:', 'hoi4-economic-simulator'); ?></strong>
                <p><?php _e('ブラウザのキャッシュをクリアし、他のプラグインとの競合がないか確認してください。', 'hoi4-economic-simulator'); ?></p>
            </li>
        </ul>
    </div>

    <div class="card">
        <h2><?php _e('サポート', 'hoi4-economic-simulator'); ?></h2>
        <p>
            <?php _e('問題が解決しない場合は、以下のリソースを確認してください:', 'hoi4-economic-simulator'); ?>
        </p>
        <ul>
            <li><a href="https://example.com/docs" target="_blank"><?php _e('ドキュメント', 'hoi4-economic-simulator'); ?></a></li>
            <li><a href="https://example.com/support" target="_blank"><?php _e('サポートフォーラム', 'hoi4-economic-simulator'); ?></a></li>
            <li><a href="https://example.com/faq" target="_blank"><?php _e('よくある質問', 'hoi4-economic-simulator'); ?></a></li>
        </ul>
    </div>
</div>

<style>
.card {
    background: #fff;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
    margin-top: 20px;
    padding: 20px;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
}

.card h2 {
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.hoi4-simulator-preview {
    background: #f8f9fa;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 4px;
}

.form-table code {
    background: #f6f7f7;
    padding: 4px 8px;
    border-radius: 3px;
}

.notice code {
    background: #f6f7f7;
    padding: 4px 8px;
    border-radius: 3px;
}
</style>
