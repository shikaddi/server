import { buttonAction } from '@server/world/action/button-action';
import { wrapText } from '@server/util/strings';
import { pluginActions } from '@server/game-server';
import { widgets } from '@server/config';

export const action: buttonAction = (details) => {
    const { player, buttonId } = details;
    const [questData] = pluginActions.quest.filter((quest) => quest.quest.questTabId === buttonId);
    if(!questData) {
        return;
    }
    const quest = questData.quest;

    const [playerQuest] = player.quests.filter(
        (playerQuest) => playerQuest.questId === quest.questTabId
    );

    let playerStage = 'NOT_STARTED';
    if (playerQuest && playerQuest.stage) {
        playerStage = playerQuest.stage;
    }

    let stageText = quest.stages[playerStage];
    let color = 128;

    if(typeof stageText === 'function') {
        stageText = stageText(player);
    } else if(typeof stageText !== 'string' && typeof stageText === 'object') {
        color = stageText.color;
        stageText = stageText.text;
    }

    let lines;
    if(stageText) {
        lines = wrapText(stageText as string, 395);
    } else {
        lines = [ 'Invalid Quest Stage' ];
    }

    player.modifyWidget(widgets.questJournal, { childId: 2, text: '@dre@' + quest.name });

    for(let i = 0; i <= 100; i++) {
        if(i === 0) {
            player.modifyWidget(widgets.questJournal, { childId: 3, text: `<col=${color}>${lines[0]}</col>` });
            continue;
        }

        if(lines.length > i) {
            player.modifyWidget(widgets.questJournal, { childId: (i + 4), text: `<col=${color}>${lines[i]}</col>` });
        } else {
            player.modifyWidget(widgets.questJournal, { childId: (i + 4), text: '' });
        }
    }

    player.interfaceState.openWidget(widgets.questJournal, {
        slot: 'screen',
        multi: false
    });
};

export default { type: 'button', widgetId: widgets.questTab, action };
