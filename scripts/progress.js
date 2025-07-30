// IndexedDB初始化
const dbPromise = idb.openDB('LearningDB', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('progress')) {
            db.createObjectStore('progress', {keyPath: 'topic'});
        }
    }
});

// 进度追踪函数
async function trackProgress(topic, score) {
    const db = await dbPromise;
    const tx = db.transaction('progress', 'readwrite');
    const store = tx.objectStore('progress');
    
    const existing = await store.get(topic);
    if (existing) {
        existing.score = Math.max(existing.score, score);
        await store.put(existing);
    } else {
        await store.add({topic, score, timestamp: Date.now()});
    }
}

// 生成学习报告
async function generateReport() {
    const db = await dbPromise;
    const data = await db.getAll('progress');
    // 返回Promise以便调用者处理数据
    return data.sort((a,b) => b.score - a.score);
}