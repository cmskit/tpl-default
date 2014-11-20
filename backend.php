<?php


$data = array(
    'projectName' => $projectName,
    'objectName' => ($objectName ? '"' . $objectName . '"' : 'false'),
    'settings' => @json_encode($_SESSION[$projectName]['settings']),
    'store' => '{}',
    'columns' => (!empty($_GET['columns']) ? '[' . $_GET['columns'] . ']' : 'settings.templates.default.columns'),
    'lang' => $lang,
    'userId' => $_SESSION[$projectName]['special']['user']['id'],
    'userName' => $_SESSION[$projectName]['special']['user']['prename'] . ' ' . $_SESSION[$projectName]['special']['user']['lastname'],
    'userProfiles' => !empty($_SESSION[$projectName]['special']['user']['profiles']) ? json_encode($_SESSION[$projectName]['special']['user']['profiles']) : '{}',
    'langLabels' => json_encode(
                                    L(array(
                                        'saved',
                                        'connected',
                                        'list_appended',
                                        'new_entry',
                                        'entry_created',
                                        'connections_saved',
                                        'transfer',
                                        'transferred',
                                        'delete_entry',
                                        'deleted',
                                        'error'
                                    )
                                )
    ),
    'client' => json_encode($_SESSION[$projectName]['client']),
    'jquerypath' => '../vendor/cmskit/jquery-ui',
    'theme' => is_array($_SESSION[$projectName]['settings']['interface']['theme']) ? end($_SESSION[$projectName]['settings']['interface']['theme']) : 'smoothness',
    'dropdowns' => buildDropdowns($projectName, $objectName, $user_wizards),

    'logo' => file_exists($projectPath . '/objects/logo.png'),

    'L' => L(array(
        'logout',
        'search',
        )
    ),


);



include_once 'templates/default/tpl/defaultTpl/tpl.php';

$tpl = new defaultTpl();

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<?php
echo $tpl->render_page($data);
?>
</html>